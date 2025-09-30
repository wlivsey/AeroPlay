import { RouteEngine } from '../src/services/RouteEngine';

describe('RouteEngine', () => {
  let engine: RouteEngine;

  beforeEach(() => {
    engine = new RouteEngine();
  });

  describe('haversineDistance', () => {
    it('should calculate distance between LAX and JFK correctly', () => {
      const distance = engine.haversineDistance(
        33.9425, -118.4081, // LAX
        40.6413, -73.7781   // JFK
      );
      expect(Math.round(distance)).toBe(3983); // km
    });

    it('should return 0 for same location', () => {
      const distance = engine.haversineDistance(40, -75, 40, -75);
      expect(distance).toBe(0);
    });
  });

  describe('initialBearing', () => {
    it('should calculate bearing from LAX to JFK', () => {
      const bearing = engine.initialBearing(
        33.9425, -118.4081, // LAX
        40.6413, -73.7781   // JFK
      );
      expect(Math.round(bearing)).toBe(66); // degrees
    });

    it('should return 0 for due north', () => {
      const bearing = engine.initialBearing(0, 0, 10, 0);
      expect(bearing).toBe(0);
    });

    it('should return 90 for due east', () => {
      const bearing = engine.initialBearing(0, 0, 0, 10);
      expect(bearing).toBe(90);
    });
  });

  describe('crossTrackDistance', () => {
    it('should calculate cross-track distance correctly', () => {
      // Point to the right of LAX-JFK track
      const crossTrack = engine.crossTrackDistance(
        35, -95, // Point in mid-US
        33.9425, -118.4081, // LAX
        40.6413, -73.7781   // JFK
      );
      expect(crossTrack).toBeGreaterThan(0); // Right side
    });

    it('should return negative for left side', () => {
      // Point to the left of LAX-JFK track
      const crossTrack = engine.crossTrackDistance(
        45, -95, // Point north of track
        33.9425, -118.4081, // LAX
        40.6413, -73.7781   // JFK
      );
      expect(crossTrack).toBeLessThan(0); // Left side
    });
  });

  describe('alongTrackDistance', () => {
    it('should calculate along-track distance', () => {
      const alongTrack = engine.alongTrackDistance(
        37, -95, // Point roughly midway
        33.9425, -118.4081, // LAX
        40.6413, -73.7781   // JFK
      );
      const totalDistance = engine.haversineDistance(
        33.9425, -118.4081,
        40.6413, -73.7781
      );
      expect(alongTrack).toBeGreaterThan(0);
      expect(alongTrack).toBeLessThan(totalDistance);
    });
  });

  describe('planRoute', () => {
    it('should calculate route metrics for B737 flight', () => {
      const schedDep = new Date('2024-01-01T10:00:00Z');
      const schedArr = new Date('2024-01-01T15:30:00Z'); // 5.5 hours

      const metrics = engine.planRoute(
        33.9425, -118.4081, // LAX
        40.6413, -73.7781,  // JFK
        schedDep, schedArr,
        'B737'
      );

      expect(metrics.airborneMin).toBe(305); // 5.5 hours - 25 min taxi
      expect(Math.round(metrics.distanceNm)).toBe(2151);
      expect(metrics.speedKt).toBe(450);
    });
  });

  describe('annotateLandmarks', () => {
    it('should annotate landmarks along route', () => {
      const route = { airborneMin: 300, distanceNm: 2000, speedKt: 450 };
      const origin = { lat: 33.9425, lon: -118.4081 }; // LAX
      const dest = { lat: 40.6413, lon: -73.7781 };     // JFK

      const landmarks = [
        { name: 'Grand Canyon', lat: 36.1069, lon: -112.1129 },
        { name: 'Denver', lat: 39.7392, lon: -104.9903 },
        { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
        { name: 'Toronto', lat: 43.6532, lon: -79.3832 }, // Too far north
      ];

      const events = engine.annotateLandmarks(route, origin, dest, landmarks);

      expect(events.length).toBe(3); // Toronto excluded
      expect(events[0].landmark.name).toBe('Grand Canyon');
      expect(events[0].side).toBe('left');
      expect(events[1].landmark.name).toBe('Denver');
      expect(events[2].landmark.name).toBe('Chicago');

      // Check ETA ordering
      expect(events[0].etaMin).toBeLessThan(events[1].etaMin);
      expect(events[1].etaMin).toBeLessThan(events[2].etaMin);
    });

    it('should handle empty landmark list', () => {
      const route = { airborneMin: 300, distanceNm: 2000, speedKt: 450 };
      const origin = { lat: 33.9425, lon: -118.4081 };
      const dest = { lat: 40.6413, lon: -73.7781 };

      const events = engine.annotateLandmarks(route, origin, dest, []);
      expect(events).toEqual([]);
    });
  });
});