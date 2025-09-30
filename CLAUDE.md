# AeroPlay - Enterprise-Grade Kids' In-Flight Travel Companion App

**Mission**: Build an offline-first, low-API-cost mobile app that transforms flights into educational adventures for kids aged 4-12, providing real-time landmark spotting, aviation facts, and interactive games without requiring live flight tracking APIs.

---

## 1. Product Requirements Document (PRD)

### 1.1 Users & Personas

**Primary Users**:
- **Young Explorer (4-7 years)**: Pre-readers/early readers who love visual content, simple games, and "I Spy" activities
- **Junior Aviator (8-12 years)**: Curious about how things work, enjoys facts, challenges, and achievements
- **Parent/Guardian**: Seeks quality screen time, educational content, offline reliability, and peace during flights

### 1.2 Problem Statement

Families face a "connectivity desert" during flights where traditional entertainment apps fail, and parents struggle to keep children engaged productively. Current solutions either require expensive in-flight WiFi, drain battery with GPS, or offer generic content unrelated to the unique experience of flying.

### 1.3 Scope

**MVP (v0.1)**:
- Pre-flight route pack download
- Basic landmark tracking with time-based estimates
- 20 curated landmark cards per major US route
- Aircraft/airline fact cards
- Simple "Look out the window" notifications

**v1.0 (Enterprise Release)**:
- 500+ global routes with regional content
- Multi-language support (EN, ES, FR, DE, ZH, JA)
- Parent dashboard with trip history
- Offline achievement system
- Cloud type identification game
- Constellation viewer for night flights

### 1.4 Success Metrics

- **Engagement Rate**: 70% of kids complete at least 3 landmark spots per flight
- **Mission Completion**: 50% complete age-appropriate "Flight Missions"
- **Battery Efficiency**: <5% battery drain per hour of use
- **Parent Satisfaction**: 4.5+ app store rating, 80% would recommend

### 1.5 Non-Goals

- Real-time flight tracking or GPS usage
- Social features requiring connectivity
- Video streaming or large media files
- Ads or in-app purchases in kids' view
- Collection of personal/location data

---

## 2. System Design

### 2.1 App Architecture

```
┌─────────────────────────────────────────────┐
│           AeroPlay Mobile App               │
├─────────────────────────────────────────────┤
│          Presentation Layer                 │
│   ┌──────────────┐ ┌──────────────┐       │
│   │   React      │ │   Native     │       │
│   │   Components │ │   Modules    │       │
│   └──────────────┘ └──────────────┘       │
├─────────────────────────────────────────────┤
│          Business Logic Layer               │
│   ┌──────────────┐ ┌──────────────┐       │
│   │Route Engine  │ │Content Engine│       │
│   │(Time-based)  │ │  (Caching)   │       │
│   └──────────────┘ └──────────────┘       │
├─────────────────────────────────────────────┤
│          Data Layer                         │
│   ┌──────────────┐ ┌──────────────┐       │
│   │   SQLite     │ │   MMKV       │       │
│   │  (Content)   │ │  (Prefs)     │       │
│   └──────────────┘ └──────────────┘       │
├─────────────────────────────────────────────┤
│          Offline Storage                    │
│   Route Packs (~50MB each)                 │
│   Base Content (~20MB)                     │
└─────────────────────────────────────────────┘
```

### 2.2 Data Model

```typescript
// Core Entities
interface RoutePack {
  id: string;
  origin: Airport;
  destination: Airport;
  landmarks: Landmark[];
  corridorTiles: MapTile[];
  downloadedAt: Date;
  expiresAt: Date;
  sizeBytes: number;
}

interface Airport {
  icao: string;
  iata: string;
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  timezone: string;
  facts: AviationFact[];
}

interface Landmark {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'natural' | 'city' | 'structure' | 'water';
  description: string;
  kidFacts: string[];
  imageUrl?: string;
  cached?: boolean;
}

interface FlightPlan {
  id: string;
  airline: string;
  aircraftType: string;
  seatSide: 'left' | 'right';
  scheduledDeparture: Date;
  scheduledArrival: Date;
  actualDeparture?: Date;
  routePack: RoutePack;
  currentProgress?: RouteProgress;
}

interface RouteProgress {
  elapsedMinutes: number;
  estimatedPosition: GeoPoint;
  upcomingLandmarks: LandmarkEvent[];
  completedLandmarks: string[];
}
```

### 2.3 File Structure

```
skystory/
├── android/
├── ios/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── SafeAreaView.tsx
│   │   │   ├── ThemedText.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── preflight/
│   │   │   ├── FlightSetup.tsx
│   │   │   ├── RoutePackDownloader.tsx
│   │   │   └── SeatSelector.tsx
│   │   ├── inflight/
│   │   │   ├── FlightTimeline.tsx
│   │   │   ├── LandmarkCard.tsx
│   │   │   ├── WindowAlert.tsx
│   │   │   └── ProgressMap.tsx
│   │   └── games/
│   │       ├── LiveryMatcher.tsx
│   │       ├── StateShapeQuiz.tsx
│   │       └── CloudSpotter.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── PreFlightScreen.tsx
│   │   ├── InFlightScreen.tsx
│   │   ├── GamesScreen.tsx
│   │   └── ParentDashboard.tsx
│   ├── services/
│   │   ├── RouteEngine.ts
│   │   ├── ContentCache.ts
│   │   ├── NotificationService.ts
│   │   └── TTSService.ts
│   ├── utils/
│   │   ├── geomath.ts
│   │   ├── timeUtils.ts
│   │   └── compression.ts
│   ├── data/
│   │   ├── aircraft.json
│   │   ├── airlines.json
│   │   └── baseContent.json
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── App.tsx
├── __tests__/
│   ├── RouteEngine.test.ts
│   ├── geomath.test.ts
│   └── LandmarkAnnotation.test.ts
├── assets/
│   ├── images/
│   ├── sounds/
│   └── fonts/
├── package.json
├── tsconfig.json
└── babel.config.js
```

### 2.4 Basemap Strategy

**Approach**: Hybrid vector + raster strips
- Pre-rendered route corridor strips (30km width) as PNG tiles
- Vector overlays for landmarks, cities, water bodies
- Compressed to ~5MB per route using WebP format
- Fallback to abstract flight path visualization if maps unavailable

---

## 3. Routing & Timing Algorithm

### 3.1 Core Algorithm

```typescript
// No GPS approach - purely time-based dead reckoning
class RouteEngine {
  // Great circle distance and bearing
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private initialBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return (θ * 180 / Math.PI + 360) % 360;
  }

  // Cross-track distance (+ = right, - = left of track)
  private crossTrackDistance(lat: number, lon: number,
                            trackLat1: number, trackLon1: number,
                            trackLat2: number, trackLon2: number): number {
    const d13 = this.haversineDistance(trackLat1, trackLon1, lat, lon);
    const θ13 = this.initialBearing(trackLat1, trackLon1, lat, lon);
    const θ12 = this.initialBearing(trackLat1, trackLon1, trackLat2, trackLon2);

    const crossTrack = Math.asin(Math.sin(d13/6371) *
                                 Math.sin((θ13-θ12) * Math.PI/180)) * 6371;
    return crossTrack;
  }

  // Along-track distance
  private alongTrackDistance(lat: number, lon: number,
                            trackLat1: number, trackLon1: number,
                            trackLat2: number, trackLon2: number): number {
    const d13 = this.haversineDistance(trackLat1, trackLon1, lat, lon);
    const crossTrack = this.crossTrackDistance(lat, lon,
                                              trackLat1, trackLon1,
                                              trackLat2, trackLon2);
    const alongTrack = Math.sqrt(Math.pow(d13, 2) - Math.pow(crossTrack, 2));
    return alongTrack;
  }

  // Speed lookup by aircraft type
  private getCruiseSpeed(aircraftType: string): number {
    const speeds: Record<string, number> = {
      'B737': 450, 'A320': 447, 'B777': 490, 'A350': 488,
      'B787': 487, 'A380': 490, 'B747': 493, 'A330': 470,
      'E190': 430, 'CRJ9': 420, 'B757': 460, 'A321': 447
    };
    return speeds[aircraftType] || 450; // Default cruise speed in knots
  }

  planRoute(originLat: number, originLon: number,
           destLat: number, destLon: number,
           schedDep: Date, schedArr: Date,
           aircraftType: string): RouteMetrics {
    const distanceKm = this.haversineDistance(originLat, originLon, destLat, destLon);
    const distanceNm = distanceKm * 0.539957;

    // Account for taxi time (15 min departure, 10 min arrival)
    const totalMinutes = (schedArr.getTime() - schedDep.getTime()) / 60000;
    const airborneMin = totalMinutes - 25;

    const speedKt = this.getCruiseSpeed(aircraftType);

    return { airborneMin, distanceNm, speedKt };
  }

  annotateLandmarks(route: RouteMetrics, origin: GeoPoint, dest: GeoPoint,
                   landmarks: Landmark[]): LandmarkEvent[] {
    const totalDistance = this.haversineDistance(origin.lat, origin.lon,
                                                dest.lat, dest.lon);
    const events: LandmarkEvent[] = [];

    landmarks.forEach(landmark => {
      const crossTrack = this.crossTrackDistance(landmark.lat, landmark.lon,
                                                origin.lat, origin.lon,
                                                dest.lat, dest.lon);

      // Include if within 80km corridor
      if (Math.abs(crossTrack) <= 80) {
        const alongTrack = this.alongTrackDistance(landmark.lat, landmark.lon,
                                                  origin.lat, origin.lon,
                                                  dest.lat, dest.lon);

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
    });

    return events.sort((a, b) => a.etaMin - b.etaMin);
  }
}
```

### 3.2 Drift Controls

```typescript
interface DriftAdjustment {
  departureDelay: number; // minutes
  currentOffset: number;  // minutes ahead/behind schedule
}

class DriftManager {
  adjustTimeline(events: LandmarkEvent[], drift: DriftAdjustment): LandmarkEvent[] {
    const adjustmentFactor = 1 + (drift.currentOffset / 100);

    return events.map(event => ({
      ...event,
      etaMin: (event.etaMin + drift.departureDelay) * adjustmentFactor,
      userAdjusted: true
    }));
  }
}
```

---

## 4. Content Plan

### 4.1 Data Sources

**Offline Datasets**:
- **OurAirports**: 74,000+ airports (filtered to 5,000 commercial)
- **Natural Earth**: Cities, parks, landmarks (10MB compressed)
- **Custom Content**:
  - 500 airline fact cards
  - 200 aircraft profiles
  - 50 cloud types
  - 88 constellation maps

### 4.2 Preflight Fetch Strategy

```typescript
class ContentFetcher {
  async fetchRouteContent(origin: string, dest: string): Promise<RoutePack> {
    // Single API call to our CDN
    const routeId = `${origin}-${dest}`;
    const pack = await fetch(`https://cdn.skystory.app/routes/${routeId}.pack`);

    // Optional Wikipedia enrichment (max 500KB)
    const landmarks = await this.fetchLandmarkSummaries(pack.landmarkIds);

    // Cache for 30 days
    await this.cache.store(routeId, pack, 30 * 24 * 60 * 60 * 1000);

    return pack;
  }
}
```

### 4.3 Compression Strategy

- Route packs: Brotli compression (~70% reduction)
- Images: WebP format with quality 80
- JSON: MessagePack encoding
- Target sizes:
  - Short flight (< 500nm): 30MB
  - Medium flight (500-1500nm): 50MB
  - Long flight (> 1500nm): 70MB

---

## 5. UX Flows & Kid Games

### 5.1 User Flows

**Pre-Flight Setup**:
1. Parent enters flight details (airline, flight number, seat)
2. App fetches route pack if connected
3. Kid picks avatar and difficulty level
4. Download completes, ready for offline use

**In-Flight Timeline**:
1. "Takeoff detected" (manual start or scheduled time)
2. Progress bar shows flight position
3. Landmark alerts 5 minutes before viewing window
4. "Look left/right" notifications with fun facts
5. Completed landmarks unlock achievement badges

### 5.2 Mini-Games

**Livery Matcher**:
- Match airline logos to tail designs
- Timed challenge with increasing difficulty
- Unlock rare liveries as rewards

**State Shape Quiz**:
- Identify states/countries from outline
- Hints based on landmarks you've passed
- Multiplayer mode with seat neighbor

**Cloud Spotter**:
- Identify cloud types from window
- AR overlay showing cloud names (v2)
- Weather prediction mini-lesson

### 5.3 Accessibility Features

- **Visual**: High contrast mode, 2x font scaling
- **Audio**: Full TTS narration, sound effects for actions
- **Motor**: Large touch targets (44pt minimum)
- **Cognitive**: Simple mode for younger kids

---

## 6. Tech Stack & Packages

### 6.1 Framework: React Native + TypeScript

**Rationale**:
- Superior TypeScript support vs Flutter
- Larger ecosystem of aviation/map packages
- Better performance for our computation-heavy route engine
- Expo SDK provides most native features we need

### 6.2 Core Dependencies

```json
{
  "dependencies": {
    "react-native": "0.72.x",
    "expo": "~49.0.0",
    "expo-location": "~16.1.0",
    "expo-notifications": "~0.20.1",
    "expo-speech": "~11.3.0",
    "expo-sqlite": "~11.3.3",
    "react-native-mmkv": "^2.10.0",
    "react-navigation": "^6.x",
    "react-native-maps": "1.7.1",
    "react-native-svg": "13.9.0",
    "geolib": "^3.3.4",
    "date-fns": "^2.30.0",
    "lottie-react-native": "6.0.1"
  }
}
```

### 6.3 Native Modules Needed

- **iOS**: CoreLocation (background updates), AVSpeechSynthesizer
- **Android**: LocationManager, TextToSpeech API

---

## 7. Scaffold Code

### 7.1 Project Setup

```bash
npx create-expo-app skystory --template
cd skystory
npm install --save-dev typescript @types/react @types/react-native
npx expo install expo-speech expo-sqlite expo-notifications
```

### 7.2 Core Route Engine Implementation

```typescript
// src/services/RouteEngine.ts
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
```

### 7.3 Test Suite

```typescript
// __tests__/RouteEngine.test.ts
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
```

### 7.4 Main App Component

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { HomeScreen } from './src/screens/HomeScreen';
import { PreFlightScreen } from './src/screens/PreFlightScreen';
import { InFlightScreen } from './src/screens/InFlightScreen';
import { ContentCache } from './src/services/ContentCache';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      await ContentCache.initialize();
      setIsReady(true);
    }
    initialize();
  }, []);

  if (!isReady) {
    return null; // Or splash screen
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PreFlight" component={PreFlightScreen} />
          <Stack.Screen name="InFlight" component={InFlightScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

### 7.5 Package.json

```json
{
  "name": "skystory",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "expo-speech": "~11.3.0",
    "expo-sqlite": "~11.3.3",
    "expo-notifications": "~0.20.1",
    "react-native-mmkv": "^2.10.2",
    "react-native-maps": "1.7.1",
    "react-native-svg": "13.9.0",
    "date-fns": "^2.30.0",
    "lottie-react-native": "6.0.1"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@types/react": "~18.2.14",
    "@types/react-native": "~0.72.0",
    "@types/jest": "^29.5.0",
    "typescript": "^5.1.3",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-native": "^4.1.0"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "moduleFileExtensions": ["ts", "tsx", "js"],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*\\.(test|spec))\\.(ts|tsx|js)$",
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts"
    ]
  },
  "private": true
}
```

---

## 8. QA Plan

### 8.1 Test Matrix

| Scenario | Test Cases | Acceptance Criteria |
|----------|------------|-------------------|
| **Flight Duration** | Short (<2hr), Medium (2-5hr), Long (>5hr) | All landmarks displayed correctly, timing accurate ±5 min |
| **Time of Day** | Day departure, Night departure, Red-eye | Appropriate content (sun/stars), night mode auto-enables |
| **Seat Position** | Left window (A), Right window (F), Middle | Correct side indicators, middle gets both sides |
| **Schedule Variance** | On-time, 30min late, 1hr early arrival | Timeline adjusts, notifications adapt |
| **Network** | Full offline, Intermittent, Connected | Core features work offline, graceful degradation |
| **Device** | iOS 14+, Android 10+, Tablets | UI scales, performance acceptable |

### 8.2 Performance Requirements

- **App Size**: < 100MB initial download
- **Route Pack**: < 70MB per route
- **Launch Time**: < 3 seconds cold start
- **Battery**: < 5% drain per hour active use
- **Memory**: < 200MB RAM usage
- **FPS**: Maintain 60fps during animations

### 8.3 Offline Instrumentation

```typescript
class OfflineAnalytics {
  private events: AnalyticsEvent[] = [];

  track(event: string, properties?: object) {
    this.events.push({
      event,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });

    // Store locally, sync when connected
    AsyncStorage.setItem('analytics_queue', JSON.stringify(this.events));
  }

  // Sync when network available
  async sync() {
    if (await NetInfo.fetch().isConnected) {
      await this.uploadEvents(this.events);
      this.events = [];
    }
  }
}
```

---

## 9. Future Enhancements (Low-Cost)

### 9.1 Phase 2 Features

**Sun Position Calculator**:
```typescript
class SunPosition {
  calculate(lat: number, lon: number, date: Date): { azimuth: number; altitude: number } {
    // Astronomical calculations for sun position
    // Explains why one side of plane is bright
  }
}
```

**AR Postcard Generator**:
- Overlay landmark info on camera view
- Save as shareable postcard
- No network required (on-device processing)

**Barometer Integration**:
- Detect actual takeoff/landing via pressure change
- Estimate altitude without GPS
- Correlate with expected flight profile

### 9.2 Expansion Opportunities

1. **White-Label Enterprise**: Airlines can customize with their branding
2. **Educational Partnerships**: Schools use for geography lessons
3. **Family Subscription**: Sync across family devices
4. **Accessibility Focus**: Partner with vision/hearing organizations

---

## Implementation Strategy for Crystal

### Phase 1: Core Engine (Week 1)
1. Implement and test RouteEngine
2. Build landmark annotation system
3. Create offline storage layer

### Phase 2: Content Pipeline (Week 2)
1. Process airport/landmark datasets
2. Build route pack generator
3. Implement compression system

### Phase 3: UI Foundation (Week 3-4)
1. Create navigation structure
2. Build pre-flight setup flow
3. Implement in-flight timeline view

### Phase 4: Games & Polish (Week 5-6)
1. Add mini-games
2. Implement TTS/accessibility
3. Parent dashboard
4. Performance optimization

### Phase 5: Testing & Launch (Week 7-8)
1. QA across devices
2. Beta testing with families
3. App store optimization
4. Launch preparation

---

## Success Metrics

### Launch Goals (Month 1)
- 10,000 downloads
- 4.5+ app store rating
- 50% day-1 retention
- 3 flights per active user

### Growth Goals (Year 1)
- 500,000 active families
- 50 airline partnerships
- 95% offline reliability
- Top 10 in Kids/Education category

---

## Architecture Decisions Record (ADR)

### ADR-001: React Native over Flutter
**Date**: 2024-01-01
**Status**: Accepted
**Context**: Need cross-platform framework with strong ecosystem
**Decision**: React Native for better TypeScript support and npm ecosystem
**Consequences**: Slightly larger app size, but better developer velocity

### ADR-002: Time-based positioning over GPS
**Date**: 2024-01-01
**Status**: Accepted
**Context**: GPS unreliable in aircraft, privacy concerns
**Decision**: Dead reckoning using flight schedule
**Consequences**: Less accurate but more reliable and private

### ADR-003: SQLite over Realm
**Date**: 2024-01-01
**Status**: Accepted
**Context**: Need offline database for content
**Decision**: SQLite with expo-sqlite for stability
**Consequences**: Manual migration management, but rock-solid reliability

---

This comprehensive plan provides the foundation for building SkyStory as an enterprise-grade application that families will depend on for every flight. The modular architecture and Crystal-based development approach will enable rapid iteration while maintaining code quality.