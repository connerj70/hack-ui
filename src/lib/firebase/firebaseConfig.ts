import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_UmrDBbyCY1wm4vuaP1IlT5aDB4Qzw8o",
  authDomain: "renaissance-hack.firebaseapp.com",
  projectId: "renaissance-hack",
  storageBucket: "renaissance-hack.appspot.com",
  messagingSenderId: "630597376133",
  appId: "1:630597376133:web:7b104ac6b3e3b84a0f71ec",
  measurementId: "G-TKM9P5P6JG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const analytics = getAnalytics(app);

export { auth, analytics };
