import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyCAybtREcntMMH0aCQsC66hvHSkltNjOxs",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "notificationservice-aacfd.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "notificationservice-aacfd",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "notificationservice-aacfd.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "608303593847",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:608303593847:web:8add551875954e2ed20972",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    "G-QL8X259HRX",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const messaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export { app, getToken, onMessage };
