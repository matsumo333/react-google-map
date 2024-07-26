// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore をインポート

const firebaseConfig = {
  apiKey: "AIzaSyCyOhXvE1YRvg19WhSzHDffGe95fXKKX0A",
  authDomain: "react--map-64573.firebaseapp.com",
  projectId: "react--map-64573",
  storageBucket: "react--map-64573.appspot.com",
  messagingSenderId: "289752151691",
  appId: "1:289752151691:web:3e838550c8a2a97c6c068e",
  measurementId: "G-V1DP5YGVR0",
};

// Firebase を初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore インスタンスを作成

export { db }; // db をエクスポート
