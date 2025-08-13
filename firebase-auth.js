// firebase-auth.js
// Central Firebase init + helpers used by all pages

// Modular SDK imports (v10.12.2)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  signOut as _signOut,
  onAuthStateChanged as _onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ---- YOUR FIREBASE CONFIG (toolspay-54167) ----
const firebaseConfig = {
  apiKey: "AIzaSyD-BIOpzkQBtpW1LQk7Rf3c-ZvyIbvEc7c",
  authDomain: "toolspay-54167.firebaseapp.com",
  projectId: "toolspay-54167",
  storageBucket: "toolspay-54167.firebasestorage.app",
  messagingSenderId: "71318117342",
  appId: "1:71318117342:web:1952711453e19e19281b4f"
};
// -----------------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* ---------- AUTH wrappers ---------- */
async function createUserWithEmailAndPassword(email, password) {
  return _createUserWithEmailAndPassword(auth, email, password);
}
async function signInWithEmailAndPassword(email, password) {
  return _signInWithEmailAndPassword(auth, email, password);
}
async function sendPasswordResetEmail(email) {
  return _sendPasswordResetEmail(auth, email);
}
async function signOut() {
  return _signOut(auth);
}
function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb); // NOTE: callback only (no auth param needed)
}

/* ---------- Admin helper ---------- */
async function addAdminByEmail(email) {
  await setDoc(doc(db, "admins", email), { createdAt: serverTimestamp() }, { merge: true });
}

/* ---------- (extra helpers kept for other pages) ---------- */
async function uploadChatImage(file, chatId) {
  const key = `chat-uploads/${chatId || "unknown"}-${Date.now()}`;
  const r = storageRef(storage, key);
  await uploadBytes(r, file);
  return await getDownloadURL(r);
}

export {
  app, auth, db, storage,
  // auth wrappers
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  addAdminByEmail,
  // firestore/storage exports (so pages can use them)
  doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, updateDoc,
  onSnapshot, deleteDoc, serverTimestamp,
  storageRef, uploadBytes, getDownloadURL,
};
