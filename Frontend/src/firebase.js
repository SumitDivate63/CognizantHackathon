// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQkzgitejmuFb_drRHf2AQS8ebYgJjtR4",
  authDomain: "cognizant-54cee.firebaseapp.com",
  projectId: "cognizant-54cee",
  storageBucket: "cognizant-54cee.firebasestorage.app",
  messagingSenderId: "799339184618",
  appId: "1:799339184618:web:de426e9b56364eabd73293",
  measurementId: "G-PJT95K7H04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
