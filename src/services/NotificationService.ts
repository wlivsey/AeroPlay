import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface LandmarkNotification {
  landmarkName: string;
  side: 'left' | 'right';
  etaMinutes: number;
  facts: string[];
}

class NotificationService {
  private notificationSubscription: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Configure channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('landmarks', {
        name: 'Landmark Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3498DB',
      });
    }

    this.isInitialized = true;
  }

  async scheduleLandmarkAlert(landmark: LandmarkNotification): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🗺️ Look ${landmark.side === 'left' ? 'Left' : 'Right'}!`,
        body: `${landmark.landmarkName} coming up in ${landmark.etaMinutes} minutes`,
        data: { landmark },
        sound: 'default',
      },
      trigger: {
        seconds: Math.max((landmark.etaMinutes - 5) * 60, 10), // Alert 5 min before
      },
    });

    return notificationId;
  }

  async scheduleWindowAlert(landmark: LandmarkNotification): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `✈️ Look Out Your Window Now!`,
        body: `${landmark.landmarkName} is visible on the ${landmark.side} side`,
        data: { landmark, type: 'window_alert' },
        sound: 'default',
      },
      trigger: {
        seconds: landmark.etaMinutes * 60,
      },
    });

    return notificationId;
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  subscribeToNotifications(
    handler: (notification: Notifications.Notification) => void
  ): () => void {
    this.notificationSubscription = Notifications.addNotificationReceivedListener(handler);

    return () => {
      if (this.notificationSubscription) {
        Notifications.removeNotificationSubscription(this.notificationSubscription);
      }
    };
  }

  async presentLocalNotification(title: string, body: string, data?: any): Promise<void> {
    await Notifications.presentNotificationAsync({
      title,
      body,
      data,
    });
  }
}

export default new NotificationService();