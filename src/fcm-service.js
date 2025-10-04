import { getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "./firebase";
import { toast } from "react-toastify";
import { base_url } from "./constants";

class FCMService {
  constructor() {
    this.notificationCallbacks = [];
    console.log("FCM Service initialized");
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted");
        return true;
      } else {
        console.log("Notification permission denied");
        return false;
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  }

  async getFCMToken() {
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service Worker not supported");
      }

      await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.log("No registration token available");
        return null;
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  async refreshToken() {
    try {
      return await this.getFCMToken();
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  // Add callback for notification handling
  addNotificationCallback(callback) {
    console.log("Adding notification callback");
    this.notificationCallbacks.push(callback);
    console.log("Total callbacks:", this.notificationCallbacks.length);
  }

  // Remove callback
  removeNotificationCallback(callback) {
    console.log("Removing notification callback");
    this.notificationCallbacks = this.notificationCallbacks.filter(
      (cb) => cb !== callback
    );
    console.log("Total callbacks:", this.notificationCallbacks.length);
  }

  setupForegroundMessageListener() {
    console.log("Setting up foreground message listener");

    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const notificationData = {
        id: Date.now(),
        title: payload.notification?.title || "إشعار جديد",
        body: payload.notification?.body || "لديك رسالة جديدة",
        icon: payload.notification?.icon || "/favicon.ico",
        timestamp: new Date(),
        data: payload.data || {},
        read: false,
      };

      // Call all registered callbacks
      console.log("Calling", this.notificationCallbacks.length, "callbacks");
      this.notificationCallbacks.forEach((callback) => {
        try {
          callback(notificationData);
        } catch (error) {
          console.error("Error in notification callback:", error);
        }
      });

      // Also show browser notification if permission granted
      if (Notification.permission === "granted") {
        const browserNotification = new Notification(notificationData.title, {
          body: notificationData.body,
          icon: notificationData.icon,
          badge: "/favicon.ico",
          tag: "admin-notification",
          requireInteraction: false,
        });

        // Auto close after 5 seconds
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    });
  }

  async saveFCMTokenToServer(userId, fcmToken) {
    try {
      const response = await fetch(`${base_url}/user/save_fcm_token.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          fcm_token: fcmToken,
          device_type: "web",
          user_agent: navigator.userAgent,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log("FCM token saved successfully");
        return true;
      } else {
        console.error("Failed to save FCM token:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Error saving FCM token:", error);
      return false;
    }
  }

  async removeFCMTokenFromServer(fcmToken) {
    try {
      const response = await fetch(`${base_url}/user/remove_fcm_token.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fcm_token: fcmToken,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log("FCM token removed successfully");
        return true;
      } else {
        console.error("Failed to remove FCM token:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Error removing FCM token:", error);
      return false;
    }
  }
}

export default new FCMService();
