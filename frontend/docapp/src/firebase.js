// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyApHljn4OIdblyfAXNLYBnIn0dZeQOpclk",
  authDomain: "mern-estate-190f6.firebaseapp.com",
  projectId: "mern-estate-190f6",
  storageBucket: "mern-estate-190f6.appspot.com",
  messagingSenderId: "52207181255",
  appId: "1:52207181255:web:eed8dc700f614e412c0de2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);