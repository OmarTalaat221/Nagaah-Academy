importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAmS2HZ1_L4cae_svSGtEqCex2LsaID2v4",
  authDomain: "nagaah-ab206.firebaseapp.com",
  databaseURL: "https://nagaah-ab206-default-rtdb.firebaseio.com",
  projectId: "nagaah-ab206",
  storageBucket: "nagaah-ab206.firebasestorage.app",
  messagingSenderId: "816532963116",
  appId: "1:816532963116:web:7864fbf25a488556e7b689",
  measurementId: "G-3PE0DQRM0J",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Message:", payload);

  const notificationTitle = payload.notification?.title || "إشعار من الإدارة";
  const notificationOptions = {
    body: "لديك رسالة جديدة من الإدارة",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    tag: "admin-notification",
    requireInteraction: true,
    dir: "rtl",
    vibrate: [200, 100, 200],
    actions: [
      {
        action: "open",
        title: "فتح الموقع",
        icon: "/favicon.ico",
      },
      {
        action: "close",
        title: "إغلاق",
      },
    ],
    data: {
      url: payload.data?.url || "/",
      ...payload.data,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data?.url || "/";

    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // If a window is already open, focus it
          for (const client of clientList) {
            if (
              client.url.includes(self.location.origin) &&
              "focus" in client
            ) {
              return client.focus().then(() => {
                return client.navigate(urlToOpen);
              });
            }
          }

          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
