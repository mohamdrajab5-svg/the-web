// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRSweuWRvMaPj2KmKb-QDeEcHy1fxZPQA",
  authDomain: "studenthub-49c59.firebaseapp.com",
  projectId: "studenthub-49c59",
  storageBucket: "studenthub-49c59.firebasestorage.app",
  messagingSenderId: "695706261653",
  appId: "1:695706261653:web:42121bf83bf8cce5fc239c",
  measurementId: "G-071WBYQF05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseConfig = {
  apiKey: "AIzaSy...YOUR_KEY...xI",
  authDomain: "student-hub.firebaseapp.com",
  projectId: "student-hub",
  storageBucket: "student-hub.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:..."
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
