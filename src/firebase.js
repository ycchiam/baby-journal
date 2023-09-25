// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { Timestamp, getFirestore } from "firebase/firestore";
import dayjs from "dayjs";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvnafaMmHnQKj0C7NcamjsEmMxJoyAtvw",
  authDomain: "baby-journal-f1fe1.firebaseapp.com",
  projectId: "baby-journal-f1fe1",
  storageBucket: "baby-journal-f1fe1.appspot.com",
  messagingSenderId: "409407793230",
  appId: "1:409407793230:web:72640fbeef924fe8d37b1f",
  measurementId: "G-LS56S6904S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const toFirestoreTimestamp = (timestamp) => {
  if (timestamp instanceof dayjs) {
    return Timestamp.fromDate(new Date(timestamp.format("YYYY-MM-DD")));
  } else if (timestamp instanceof String) {
    return Timestamp.fromDate(new Date(timestamp));
  }
};
