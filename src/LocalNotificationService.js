import PushNotification from 'react-native-push-notification';
import { Platform, PushNotificationIOS } from 'react-native';


class LocalNotificationService {

    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("Local notification token ", +token);
            },
            onNotification: function (notification) {
                console.log("Local notification " + notification);
                if (!notification?.data) {
                    return;
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

                if (Platform.OS === 'ios') {

                }
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            popInitialNotification: true,

            requestPermissions: true
        })
    }

    unregister = () => {
        PushNotification.unregister();
    }


    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            ...this.buildAndroidNotification(id, title, message, data, options),
            // ...this.buildIosNotification(id, title, message, data, options),

            title: title || "",
            message: message || "",
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction: false
        });
    }

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || 'ic_launcher',
            smallIcon: options.smallIcon || "ic_notification",
            bigText: message || "",
            subText: title || "",
            vibrate: options.vibrate || true,
            vibration: options.vibration || 300,
            priority: options.priority || "high",
            importance: options.importance || "high",
            data: data
        }
    }

    cancelAllLocalNotifications = () => {
        if (Platform.OS === 'ios') {
            // PushNotificationIOS.remmoveAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationByID = (notificationId) => {
        console.log("Local Service removed notification " + notificationId);
        PushNotification.cancelLocalNotifications({ id: `${notificationId}` })
    }
}

export const localService = new LocalNotificationService();