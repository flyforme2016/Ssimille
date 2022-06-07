/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {initializeFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBEm58OIgvB_Emy7GVPSDisdcgv-1DQJNQ',
  authDomain: 'ssimille-d0717.firebaseapp.com',
  databaseURL: 'https://ssimille-d0717-default-rtdb.firebaseio.com',
  projectId: 'ssimille-d0717',
  storageBucket: 'ssimille-d0717.appspot.com',
  messagingSenderId: '438016180202',
  appId: '1:438016180202:web:a22de1a08a3eb3b43e7c93',
  measurementId: 'G-3YSK4QB8X6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const database = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
