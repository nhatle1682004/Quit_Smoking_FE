// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB48vBxNYOijF2FF4NwFbC8TySj_pUj6Eo",
  authDomain: "quitsmoking-555f1.firebaseapp.com",
  projectId: "quitsmoking-555f1",
  storageBucket: "quitsmoking-555f1.firebasestorage.app",
  messagingSenderId: "1023911639813",
  appId: "1:1023911639813:web:8bfd11b671ddfbd6f4556c",
  measurementId: "G-LQVS45ML99"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth();
