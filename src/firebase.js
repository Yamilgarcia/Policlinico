import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRO0Ow4xOMxHkGstQMRD_vd3yX1kisYiM",
  authDomain: "policlinico-1a45a.firebaseapp.com",
  projectId: "policlinico-1a45a",
  storageBucket: "policlinico-1a45a.appspot.com",
  messagingSenderId: "412643347368",
  appId: "1:412643347368:web:6570c3aec0bd5cb44a6b9d",
  measurementId: "G-7TK9H1B4CX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
