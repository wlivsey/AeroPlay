import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RoutePack {
  id: string;
  origin: { code: string; name: string; lat: number; lon: number };
  destination: { code: string; name: string; lat: number; lon: number };
  landmarks: Array<{
    id: string;
    name: string;
    lat: number;
    lon: number;
    type: 'natural' | 'city' | 'structure' | 'water';
    description: string;
    kidFacts: string[];
  }>;
  downloadedAt: Date;
  expiresAt: Date;
  sizeBytes: number;
}

export class ContentCache {
  private static readonly CACHE_PREFIX = '@aeroplay_cache_';
  private static readonly ROUTE_PACK_PREFIX = '@aeroplay_route_';
  private static readonly SETTINGS_KEY = '@aeroplay_settings';

  static async initialize(): Promise<void> {
    try {
      // Check if this is first launch
      const settings = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (!settings) {
        await this.setDefaultSettings();
      }

      // Clean expired cache
      await this.cleanExpiredCache();
    } catch (error) {
      console.error('Failed to initialize ContentCache:', error);
    }
  }

  private static async setDefaultSettings(): Promise<void> {
    const defaultSettings = {
      firstLaunch: new Date().toISOString(),
      cacheVersion: '1.0.0',
      offlineMode: false,
    };
    await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaultSettings));
  }

  static async storeRoutePack(routePack: RoutePack): Promise<void> {
    const key = `${this.ROUTE_PACK_PREFIX}${routePack.id}`;
    const data = JSON.stringify({
      ...routePack,
      downloadedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    });

    await AsyncStorage.setItem(key, data);
  }

  static async getRoutePack(routeId: string): Promise<RoutePack | null> {
    try {
      const key = `${this.ROUTE_PACK_PREFIX}${routeId}`;
      const data = await AsyncStorage.getItem(key);

      if (!data) return null;

      const routePack = JSON.parse(data);

      // Check if expired
      if (new Date(routePack.expiresAt) < new Date()) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return routePack;
    } catch (error) {
      console.error('Failed to get route pack:', error);
      return null;
    }
  }

  static async getAllRoutePacks(): Promise<RoutePack[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const routePackKeys = keys.filter((key: string) => key.startsWith(this.ROUTE_PACK_PREFIX));

      const routePacks: RoutePack[] = [];

      for (const key of routePackKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const routePack = JSON.parse(data);
          if (new Date(routePack.expiresAt) >= new Date()) {
            routePacks.push(routePack);
          }
        }
      }

      return routePacks;
    } catch (error) {
      console.error('Failed to get all route packs:', error);
      return [];
    }
  }

  static async deleteRoutePack(routeId: string): Promise<void> {
    const key = `${this.ROUTE_PACK_PREFIX}${routeId}`;
    await AsyncStorage.removeItem(key);
  }

  static async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        if (key.startsWith(this.CACHE_PREFIX) || key.startsWith(this.ROUTE_PACK_PREFIX)) {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            totalSize += new Blob([data]).size;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return 0;
    }
  }

  static async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        (key: string) => key.startsWith(this.CACHE_PREFIX) || key.startsWith(this.ROUTE_PACK_PREFIX)
      );

      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  private static async cleanExpiredCache(): Promise<void> {
    try {
      const routePacks = await this.getAllRoutePacks();
      const now = new Date();

      for (const pack of routePacks) {
        if (new Date(pack.expiresAt) < now) {
          await this.deleteRoutePack(pack.id);
        }
      }
    } catch (error) {
      console.error('Failed to clean expired cache:', error);
    }
  }

  // Mock function to simulate fetching route content from CDN
  static async fetchRouteContent(origin: string, destination: string): Promise<RoutePack> {
    // In production, this would make an actual API call to your CDN
    // For now, returning mock data
    const routeId = `${origin}-${destination}`;

    const mockRoutePack: RoutePack = {
      id: routeId,
      origin: {
        code: origin,
        name: origin === 'LAX' ? 'Los Angeles International' : origin,
        lat: 33.9425,
        lon: -118.4081,
      },
      destination: {
        code: destination,
        name: destination === 'JFK' ? 'John F. Kennedy International' : destination,
        lat: 40.6413,
        lon: -73.7781,
      },
      landmarks: [
        {
          id: '1',
          name: 'Grand Canyon',
          lat: 36.1069,
          lon: -112.1129,
          type: 'natural',
          description: 'A steep-sided canyon carved by the Colorado River',
          kidFacts: [
            'The Grand Canyon is 277 miles long!',
            'It\'s over 1 mile deep in some places!',
            'You can see rocks that are 2 billion years old!',
          ],
        },
        {
          id: '2',
          name: 'Denver',
          lat: 39.7392,
          lon: -104.9903,
          type: 'city',
          description: 'The Mile High City of Colorado',
          kidFacts: [
            'Denver is exactly 1 mile above sea level!',
            'The 13th step of the State Capitol is marked as 5,280 feet!',
            'Denver has more sunny days than Miami Beach!',
          ],
        },
        {
          id: '3',
          name: 'Chicago',
          lat: 41.8781,
          lon: -87.6298,
          type: 'city',
          description: 'The Windy City on Lake Michigan',
          kidFacts: [
            'Chicago has the world\'s first skyscraper!',
            'The city is home to the tallest building in North America!',
            'Deep dish pizza was invented here!',
          ],
        },
      ],
      downloadedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sizeBytes: 50 * 1024 * 1024, // 50MB
    };

    // Store in cache
    await this.storeRoutePack(mockRoutePack);

    return mockRoutePack;
  }
}

export default ContentCache;