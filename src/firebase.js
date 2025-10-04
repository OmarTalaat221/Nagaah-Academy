// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAmS2HZ1_L4cae_svSGtEqCex2LsaID2v4",
  authDomain: "nagaah-ab206.firebaseapp.com",
  databaseURL: "https://nagaah-ab206-default-rtdb.firebaseio.com",
  projectId: "nagaah-ab206",
  storageBucket: "nagaah-ab206.firebasestorage.app",
  messagingSenderId: "816532963116",
  appId: "1:816532963116:web:7864fbf25a488556e7b689",
  measurementId: "G-3PE0DQRM0J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const messaging = getMessaging(app);
export const VAPID_KEY =
  "BETqHkZFXpVRa3fWS1ER_-FbN4YVDMRQj3c2DBbu1SqhKBsmzZmVVDUrm_VaDxk4wkP2LxLFWfhj15-Ylvgq86I";
export default app;
