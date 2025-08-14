<script type="module">
// ===== Firebase Core (ES Modules via CDN) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc, getDoc, setDoc, updateDoc, addDoc,
  collection, query, where, orderBy, onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ===== Your Firebase Config (already inserted) =====
const firebaseConfig = {
  apiKey: "AIzaSyD-BIOpzkQBtpW1LQk7Rf3c-ZvyIbvEc7c",
  authDomain: "toolspay-54167.firebaseapp.com",
  projectId: "toolspay-54167",
  storageBucket: "toolspay-54167.firebasestorage.app",
  messagingSenderId: "71318117342",
  appId: "1:71318117342:web:1952711453e19e19281b4f"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ===== Helper: add admin by email (allowlist) =====
async function addAdminByEmail(email) {
  if (!email) throw new Error("Email required");
  await setDoc(doc(db, "admins", email), { createdAt: Date.now() }, { merge: true });
}

// ===== Helper: simple file upload to Storage =====
async function uploadFileReturnURL(file, pathPrefix = "uploads") {
  if (!file) throw new Error("No file provided");
  const path = `${pathPrefix}/${Date.now()}-${file.name}`;
  const ref = storageRef(storage, path);
  const snap = await uploadBytes(ref, file);
  return await getDownloadURL(snap.ref);
}

// ===== EXPORT everything we’ll use elsewhere =====
export {
  app,
  auth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification, updateProfile,
  db, doc, getDoc, setDoc, updateDoc, addDoc,
  collection, query, where, orderBy, onSnapshot, serverTimestamp,
  storage, uploadFileReturnURL,
  addAdminByEmail
};
</script>
