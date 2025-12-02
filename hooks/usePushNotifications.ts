import eventEmitter, { EVENTS } from '@/utils/events';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, ToastAndroid } from 'react-native';

// Configure local notifications behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export function usePushNotifications() {
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    const requestUserPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Android 13+ notification permission granted');
            } else {
                console.log('Android 13+ notification permission denied');
            }
        }

        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
        return enabled;
    };

    const subscribeToTopic = async () => {
        try {
            await messaging().subscribeToTopic('all_devices');
            console.log('Subscribed to topic: all_devices');
        } catch (error) {
            console.error('Error subscribing to topic:', error);
        }
    };

    const handleNotificationNavigation = (data: any) => {
        if (data?.image_id) {
            console.log('Navigating to alert:', data.image_id);
            // router.push(`/details/${data.image_id}`);
            eventEmitter.emit(EVENTS.REFRESH_ALERTS);
        }
    };

    useEffect(() => {
        const init = async () => {
            // Create Notification Channel for Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'Security Alerts',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const hasPermission = await requestUserPermission();
            if (hasPermission) {
                await subscribeToTopic();
                setIsInitialized(true);
            }
        };

        init();

        // Foreground message handler
        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', remoteMessage);

            if (Platform.OS === 'android') {
                ToastAndroid.show('Nueva alerta detectada', ToastAndroid.SHORT);
            }

            eventEmitter.emit(EVENTS.REFRESH_ALERTS);
        });

        // Background message handler (when app is opened from background state)
        const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage.notification);
            handleNotificationNavigation(remoteMessage.data);
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from quit state:', remoteMessage.notification);
                    handleNotificationNavigation(remoteMessage.data);
                }
            });

        // Handle user tapping on local notification
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            handleNotificationNavigation(data);
        });

        return () => {
            unsubscribeForeground();
            unsubscribeBackground();
            subscription.remove();
        };
    }, []);

    return { isInitialized };
}
