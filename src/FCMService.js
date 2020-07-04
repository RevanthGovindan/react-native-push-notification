import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

class FCMService {

    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
    }

    registerAppWithFcm = async () => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled();
        }
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission().then(
            (enabled) => {
                if (enabled) {
                    this.getToken(onRegister);
                } else {
                    this.requestPermission(onRegister)
                }
            }
        ).catch((error) => {
            console.log("permission rejected");
        })
    }

    getToken = (onRegister) => {
        messaging().getToken().
            then((fcmToken) => {
                if (fcmToken) {
                    onRegister(fcmToken);
                } else {
                    console.log("user don't have token");
                }
            }).catch((error) => {
                console.log("gettoken rejected");
            })
    }

    requestPermission = (onRegister) => {
        messaging().requestPermission().
            then(() => {
                this.getToken(onRegister)
            }).catch((error) => {
                console.log("Request permission rejected");
            })
    }

    deleteToken = () => {
        console.log("FCM delete Token");
        messaging().deleteToken().
            catch(error => {
                console.log("Delete token error");
            })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log("onNotification caused to open");
            if (remoteMessage) {
                const notification = remoteMessage.notification;
                onOpenNotification(notification)
            }
        });

        messaging().getInitialNotification()
            .then(remoteMessage => {
                console.log("getInitialNotification caused to open");
                if (remoteMessage) {
                    const notification = remoteMessage.notification;
                    onOpenNotification(notification)
                }
            }).catch((error) => {
                console.log(error);
            })

        this.messageListener = messaging().onMessage(async remoteMessage => {
            console.log("New Message");
            if (remoteMessage) {
                let notification = null
                if (Platform.OS === "ios") {
                    notification = remoteMessage.data.notification
                } else {
                    notification = remoteMessage.notification;
                }
                onNotification(notification);
            }
        });

        messaging().onTokenRefresh(fcmToken => {
            console.log("New token" + fcmToken);
            onRegister(fcmToken);
        });
    }


    unRegister = () => {
        this.messageListener();
    }
};

export const fcmService = new FCMService();