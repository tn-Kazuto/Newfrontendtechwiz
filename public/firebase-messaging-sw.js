importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCAybtREcntMMH0aCQsC66hvHSkltNjOxs",
  authDomain: "notificationservice-aacfd.firebaseapp.com",
  projectId: "notificationservice-aacfd",
  storageBucket: "notificationservice-aacfd.firebasestorage.app",
  messagingSenderId: "608303593847",
  appId: "1:608303593847:web:8add551875954e2ed20972",
  measurementId: "G-QL8X259HRX",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    "Fan Hub Plus";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/logo.webp",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
