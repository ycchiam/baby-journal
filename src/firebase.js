// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
