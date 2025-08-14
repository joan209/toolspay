<!-- firebase-auth.js -->
<script type="module">
// --- Firebase core (v10) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut, sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection,
  onSnapshot, query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// YOUR CONFIG
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
const db   = getFirestore(app);
const storage = getStorage(app);

// Helper: ensure user profile doc exists
async function ensureUserProfile(uid, email){
  const pRef = doc(db, "users", uid);
  const snap = await getDoc(pRef);
  if (!snap.exists()) {
    await setDoc(pRef, {
      email, createdAt: serverTimestamp(),
      bank: { bankName:"", accountName:"", accountNumber:"" }
    }, { merge: true });
  }
}

// Admin allowlist helper (write admins/<email>)
async function addAdminByEmail(email){
  await setDoc(doc(db, "admins", email), { createdAt: Date.now() }, { merge: true });
}

// File upload → URL
async function uploadFileAndGetURL(path, file){
  const r = ref(storage, path);
  await uploadBytes(r, file);
  return await getDownloadURL(r);
}

export {
  app, auth, db, storage,
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut, sendEmailVerification,
  doc, getDoc, setDoc, updateDoc, addDoc, collection, onSnapshot, query, where, orderBy, serverTimestamp,
  addAdminByEmail, ensureUserProfile, uploadFileAndGetURL, getDownloadURL, ref
};
</script>
