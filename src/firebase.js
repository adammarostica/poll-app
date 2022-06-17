// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaNPAdqRNDVFNViNCr0P35pQ4G5VebL3o",
  authDomain: "what-are-we-doing-friends.firebaseapp.com",
  databaseURL: "https://what-are-we-doing-friends-default-rtdb.firebaseio.com",
  projectId: "what-are-we-doing-friends",
  storageBucket: "what-are-we-doing-friends.appspot.com",
  messagingSenderId: "325453100753",
  appId: "1:325453100753:web:c07b3090da7b4f41f377f0"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;