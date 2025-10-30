// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRSweuWRvMaPj2KmKb-QDeEcHy1fxZPQA",
  authDomain: "studenthub-49c59.firebaseapp.com",
  projectId: "studenthub-49c59",
  storageBucket: "studenthub-49c59.firebasestorage.app",
  messagingSenderId: "695706261653",
  appId: "1:695706261653:web:42121bf83bf8cce5fc239c",
  measurementId: "G-071WBYQF05"
};

// Initialize Firebase (using the v8 syntax our scripts expect)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
