// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyCX76PB3gwGJmoLbVCM0r8mcvgeujdsiuw",
  authDomain: "wm-trade-catalogo.firebaseapp.com",
  projectId: "wm-trade-catalogo",
  storageBucket: "wm-trade-catalogo.appspot.com",
  messagingSenderId: "912544459569",
  appId: "1:912544459569:web:47a36cd32b25a546a89e10",
  measurementId: "G-BHLX9DTDHY",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 👇 Persiste a sessão no dispositivo (resolve o WARN e mantém login)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Log rápido (opcional)
console.log("🔑 firebaseConfig.apiKey ->", firebaseConfig.apiKey);
console.log("✅ Auth usando apiKey ->", auth.app.options.apiKey);
