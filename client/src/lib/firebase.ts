import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtWjr7LM08PJgsvDIdix52JgqG22nKIIw",
  authDomain: "newsweb-c48d7.firebaseapp.com",
  projectId: "newsweb-c48d7",
  storageBucket: "newsweb-c48d7.appspot.com",
  messagingSenderId: "192962879627",
  appId: "1:192962879627:web:3be1eca3d7c106d022b48e",
  measurementId: "G-ZQC48QFCBH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
