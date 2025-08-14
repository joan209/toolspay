<!-- file: firebase-auth.js -->
<script type="module">
  // This file is a JS Module. It exports Firebase objects & helpers for your pages.

  // Firebase v10 modular imports
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import {
    getAuth, signInWithEmailAndPassword, sendPasswordResetEmail,
    onAuthStateChanged, signOut, createUserWithEmailAndPassword, sendEmailVerification
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import {
    getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection,
    getDocs, query, where, serverTimestamp, onSnapshot
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import {
    getStorage, ref, uploadBytes, getDownloadURL, deleteObject
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

  // ====== YOUR CONFIG (as provided) ======
  const firebaseConfig = {
    apiKey: "AIzaSyD-BIOpzkQBtpW1LQk7Rf3c-ZvyIbvEc7c",
    authDomain: "toolspay-54167.firebaseapp.com",
    projectId: "toolspay-54167",
    storageBucket: "toolspay-54167.firebasestorage.app",
    messagingSenderId: "71318117342",
    appId: "1:71318117342:web:1952711453e19e19281b4f"
  };

  // Init
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Helper to allowlist admins (document id = email)
  async function addAdminByEmail(email) {
    await setDoc(doc(db, 'admins', email), {
      createdAt: serverTimestamp()
    }, { merge: true });
  }

  // Export everything we’ll need
  export {
    app, auth, db, storage,
    // auth helpers
    signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut,
    createUserWithEmailAndPassword, sendEmailVerification,
    // firestore
    doc, getDoc, setDoc, updateDoc, addDoc, collection, getDocs, query, where, serverTimestamp, onSnapshot,
    // storage
    ref, uploadBytes, getDownloadURL, deleteObject,
    // custom
    addAdminByEmail
  };
</script>
