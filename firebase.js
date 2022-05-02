// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEm58OIgvB_Emy7GVPSDisdcgv-1DQJNQ",
  authDomain: "ssimille-d0717.firebaseapp.com",
  projectId: "ssimille-d0717",
  storageBucket: "ssimille-d0717.appspot.com",
  messagingSenderId: "438016180202",
  appId: "1:438016180202:web:a22de1a08a3eb3b43e7c93",
  measurementId: "G-3YSK4QB8X6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);