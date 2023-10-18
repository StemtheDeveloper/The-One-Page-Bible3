// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOr51LjW0HVpZ6fqhHlSuGvbwSfZxnJxY",
  authDomain: "the-one-page-bible.firebaseapp.com",
  projectId: "the-one-page-bible",
  storageBucket: "the-one-page-bible.appspot.com",
  messagingSenderId: "65655216636",
  appId: "1:65655216636:web:b713dde152299207c27a79",
  measurementId: "G-4KXNJ0C7ZE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
