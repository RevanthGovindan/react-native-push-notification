import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

import { fcmService } from './src/FCMService';
import { localService } from './src/LocalNotificationService';

export default function App() {

  useEffect(() => {
    fcmService.registerAppWithFcm();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localService.configure(onOpenNotification);

    function onRegister(token) {
      console.log("Token from app " + token);
    }

    function onNotification(notify) {
      console.log("Notification from app " + notify);
      const options = {
        soundName: 'default',
        playSound: true
      };

      localService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      )
    }

    function onOpenNotification(notify) {
      console.log("onopen Notification from app " + notify);
      alert("Open notification " + notify.body);
    }

    return () => {
      console.log("Un register");
      fcmService.unRegister();
      localService.unregister();
    }

  },[]);

  return (
    <View style={styles.container}>
      <Text>Sample React native firebase</Text>
      <Button
        title="Press Me"
        onPress={() => localService.cancelAllLocalNotifications()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});