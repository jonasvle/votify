import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC1-J-96tdW_XqEQerVL9_20tXd6KNT2Fc",
  authDomain: "votify-4a185.firebaseapp.com",
  databaseURL:
    "https://votify-4a185-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "votify-4a185",
  storageBucket: "votify-4a185.appspot.com",
  messagingSenderId: "357828947524",
  appId: "1:357828947524:web:1b4933472d3d4956395611",
  measurementId: "G-023ZX1QDWV",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase();

export { analytics, auth, database };
