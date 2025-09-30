export interface RouteMetrics {
  airborneMin: number;
  distanceNm: number;
  speedKt: number;
}

export interface LandmarkEvent {
  landmark: {
    name: string;
    lat: number;
    lon: number;
  };
  etaMin: number;
  side: 'left' | 'right';
  alongTrackKm: number;
  crossTrackKm: number;
}

export class RouteEngine {
  private readonly EARTH_RADIUS_KM = 6371;
  private readonly KM_TO_NM = 0.539957;

  private toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  private toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const φ1 = this.toRadians(lat1);
    const φ2 = this.toRadians(lat2);
    const Δφ = this.toRadians(lat2 - lat1);
    const Δλ = this.toRadians(lon2 - lon1);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return this.EARTH_RADIUS_KM * c;
  }

  initialBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const φ1 = this.toRadians(lat1);
    const φ2 = this.toRadians(lat2);
    const Δλ = this.toRadians(lon2 - lon1);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return (this.toDegrees(θ) + 360) % 360;
  }

  crossTrackDistance(
    lat: number, lon: number,
    trackLat1: number, trackLon1: number,
    trackLat2: number, trackLon2: number
  ): number {
    const d13 = this.haversineDistance(trackLat1, trackLon1, lat, lon) / this.EARTH_RADIUS_KM;
    const θ13 = this.toRadians(this.initialBearing(trackLat1, trackLon1, lat, lon));
    const θ12 = this.toRadians(this.initialBearing(trackLat1, trackLon1, trackLat2, trackLon2));

    const crossTrack = Math.asin(Math.sin(d13) * Math.sin(θ13 - θ12)) * this.EARTH_RADIUS_KM;
    return crossTrack;
  }

  alongTrackDistance(
    lat: number, lon: number,
    trackLat1: number, trackLon1: number,
    trackLat2: number, trackLon2: number
  ): number {
    const d13 = this.haversineDistance(trackLat1, trackLon1, lat, lon);
    const crossTrack = Math.abs(this.crossTrackDistance(lat, lon, trackLat1, trackLon1, trackLat2, trackLon2));

    if (d13 < crossTrack) return 0; // Handle numerical errors
    const alongTrack = Math.sqrt(d13 * d13 - crossTrack * crossTrack);

    // Check if point is before start or after end
    const bearingToPoint = this.initialBearing(trackLat1, trackLon1, lat, lon);
    const trackBearing = this.initialBearing(trackLat1, trackLon1, trackLat2, trackLon2);
    const angleDiff = Math.abs(bearingToPoint - trackBearing);

    if (angleDiff > 90 && angleDiff < 270) {
      return -alongTrack; // Point is behind start
    }

    return alongTrack;
  }

  private getCruiseSpeed(aircraftType: string): number {
    const speeds: Record<string, number> = {
      'B737': 450, 'A320': 447, 'B777': 490, 'A350': 488,
      'B787': 487, 'A380': 490, 'B747': 493, 'A330': 470,
      'E190': 430, 'CRJ9': 420, 'B757': 460, 'A321': 447,
      'DEFAULT': 450
    };
    return speeds[aircraftType.toUpperCase()] || speeds.DEFAULT;
  }

  planRoute(
    originLat: number, originLon: number,
    destLat: number, destLon: number,
    schedDep: Date, schedArr: Date,
    aircraftType: string
  ): RouteMetrics {
    const distanceKm = this.haversineDistance(originLat, originLon, destLat, destLon);
    const distanceNm = distanceKm * this.KM_TO_NM;

    const totalMinutes = (schedArr.getTime() - schedDep.getTime()) / 60000;
    const airborneMin = Math.max(totalMinutes - 25, 10); // Min 10 minutes

    const speedKt = this.getCruiseSpeed(aircraftType);

    return { airborneMin, distanceNm, speedKt };
  }

  annotateLandmarks(
    route: RouteMetrics,
    origin: { lat: number; lon: number },
    dest: { lat: number; lon: number },
    landmarks: Array<{ name: string; lat: number; lon: number }>
  ): LandmarkEvent[] {
    const totalDistance = this.haversineDistance(origin.lat, origin.lon, dest.lat, dest.lon);
    const events: LandmarkEvent[] = [];

    landmarks.forEach(landmark => {
      const crossTrack = this.crossTrackDistance(
        landmark.lat, landmark.lon,
        origin.lat, origin.lon,
        dest.lat, dest.lon
      );

      // Include if within 80km corridor
      if (Math.abs(crossTrack) <= 80) {
        const alongTrack = this.alongTrackDistance(
          landmark.lat, landmark.lon,
          origin.lat, origin.lon,
          dest.lat, dest.lon
        );

        // Only include if along the route (not behind or past)
        if (alongTrack >= 0 && alongTrack <= totalDistance) {
          const progress = alongTrack / totalDistance;
          const etaMin = route.airborneMin * progress;
          const side = crossTrack > 0 ? 'right' : 'left';

          events.push({
            landmark,
            etaMin,
            side,
            alongTrackKm: alongTrack,
            crossTrackKm: Math.abs(crossTrack)
          });
        }
      }
    });

    return events.sort((a, b) => a.etaMin - b.etaMin);
  }
}

export default RouteEngine;