import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  function SendNotification() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[ftOG_VD_Nq2fjgbYMb4IhI]",
        title: "hello",
        body: "world",
      }),
    });
  }
  useEffect(() => {
    async function configureNotification() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalstatus = status;

      if (finalstatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalstatus = status;
      }
      if (finalstatus !== "granted") {
        Alert.alert(
          "Permission denied",
          "Push notificatoin requires permission"
        );
        return;
      }
      const data = await Notifications.getExpoPushTokenAsync();
      console.log(data);
    }
    configureNotification();
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification.request.content.data.name);
      }
    );

    return () => subscription.remove();
  }, []);

  function handleNotofication() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "first notification",
        body: "hello world",
        data: { name: "rushil" },
      },
      trigger: {
        seconds: 5,
      },
    });
  }
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <Button title="Get notfication" onPress={handleNotofication} />
      <Button title="send notfication" onPress={SendNotification} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
