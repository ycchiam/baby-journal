// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { Timestamp, getFirestore } from "firebase/firestore";
import dayjs from "dayjs";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const toFirestoreTimestamp = (timestamp) => {
  if (timestamp instanceof dayjs) {
    return Timestamp.fromDate(new Date(timestamp.format("YYYY-MM-DD")));
  } else if (timestamp instanceof String) {
    return Timestamp.fromDate(new Date(timestamp));
  }
};
