// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-4091122803-438ae",
  "appId": "1:713686205064:web:1ee16d3768c9aecf42153d",
  "storageBucket": "studio-4091122803-438ae.appspot.com",
  "apiKey": "AIzaSyCgOVVsEwPDkD1L0bR9kJmvGtyXpx3FYdY",
  "authDomain": "studio-4091122803-438ae.firebaseapp.com",
  "messagingSenderId": "713686205064",
  "measurementId": ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
