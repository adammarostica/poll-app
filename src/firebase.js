// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_fN-FEGWdaeIL9LBQ5MbBeJ-IxSLsnCw",
  authDomain: "react-with-firebase-bookshelf.firebaseapp.com",
  projectId: "react-with-firebase-bookshelf",
  storageBucket: "react-with-firebase-bookshelf.appspot.com",
  messagingSenderId: "196971775921",
  appId: "1:196971775921:web:4cabb426ac2ff1ec32df90"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;