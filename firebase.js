// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBnmoXODs_2oeN0Bl3ccY4hOWz0GOtKxh0",
    authDomain: "velo-s-salon.firebaseapp.com",
    projectId: "velo-s-salon",
    storageBucket: "velo-s-salon.firebasestorage.app",
    messagingSenderId: "611603078160",
    appId: "1:611603078160:web:2c13421283b50c97d17e95",
    measurementId: "G-NKHPQGE708"
};

const app = initializeApp(firebaseConfig);

// ✅ Export these so any file can import them
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);