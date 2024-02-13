// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5fa0a.firebaseapp.com",
  projectId: "mern-estate-5fa0a",
  storageBucket: "mern-estate-5fa0a.appspot.com",
  messagingSenderId: "47551835781",
  appId: "1:47551835781:web:71d49da107727f5ce8c3ec"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);