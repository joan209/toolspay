// firebase.js
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-BIOpzkQBtpW1LQk7Rf3c-ZvyIbvEc7c",
  authDomain: "toolspay-54167.firebaseapp.com",
  projectId: "toolspay-54167",
  storageBucket: "toolspay-54167.firebasestorage.app",
  messagingSenderId: "71318117342",
  appId: "1:71318117342:web:1952711453e19e19281b4f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
