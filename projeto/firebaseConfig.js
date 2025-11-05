// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFmwE_PWH9vrEOC0_19edcuuGcsObx46Y",
  authDomain: "banco-app-gestao-financeira.firebaseapp.com",
  projectId: "banco-app-gestao-financeira",
  storageBucket: "banco-app-gestao-financeira.firebasestorage.app",
  messagingSenderId: "275337681473",
  appId: "1:275337681473:web:86ce9f5bc0a8362e8d04c0",
  measurementId: "G-NNYRN5HVE1",
};

// Inicializa o app do Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços do Firebase
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🔥 Firebase inicializado com sucesso:", app.name);

export { auth, db };
