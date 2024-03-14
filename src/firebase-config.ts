import { getAuth } from "@firebase/auth";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyA2tdOulU73ADVdPhrnxQYt570L4ZBRQFQ",
  authDomain: "pomerene-dev.firebaseapp.com",
  projectId: "pomerene-dev",
  storageBucket: "pomerene-dev.appspot.com",
  messagingSenderId: "844147711427",
  appId: "1:844147711427:web:2386f0061923f540bdf176",
  measurementId: "G-6T3CY94SZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);