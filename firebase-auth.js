<script type="module">
// ---- Firebase core (single place) ----
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection,
  query, where, orderBy, onSnapshot, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// >>> YOUR CONFIG (already inserted) <<<
const firebaseConfig = {
  apiKey: "AIzaSyD-BIOpzkQBtpW1LQk7Rf3c-ZvyIbvEc7c",
  authDomain: "toolspay-54167.firebaseapp.com",
  projectId: "toolspay-54167",
  storageBucket: "toolspay-54167.firebasestorage.app",
  messagingSenderId: "71318117342",
  appId: "1:71318117342:web:1952711453e19e19281b4f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ---- Helpers (exported) ----
export {
  app, auth, db, storage,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile,
  doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, orderBy, onSnapshot, getDocs,
  ref, uploadBytes, getDownloadURL, serverTimestamp
};

// Admin allowlist helper
export async function isAdminEmail(email) {
  if (!email) return false;
  const snap = await getDoc(doc(db, "admins", email));
  return snap.exists();
}

// Add admin by email (used by grant-admin.html)
export async function addAdminByEmail(email) {
  await setDoc(doc(db, "admins", email), { createdAt: Date.now() }, { merge: true });
}

// Save a notification (admin/customer in-app)
export async function notify(userId, title, body) {
  if (!userId) return;
  await addDoc(collection(db, "users", userId, "notifications"), {
    title, body, createdAt: serverTimestamp(), read: false
  });
}

// Update user Naira balance (credit/debit)
export async function adjustBalance(userId, amountNgn, reason, refId) {
  const userDoc = doc(db, "users", userId);
  const snap = await getDoc(userDoc);
  const bal = Number(snap.data()?.balanceNgn || 0);
  const newBal = Math.max(0, bal + Number(amountNgn));
  await updateDoc(userDoc, { balanceNgn: newBal });
  await addDoc(collection(db, "users", userId, "balanceHistory"), {
    change: amountNgn, reason, refId: refId || null, createdAt: serverTimestamp()
  });
}

// Calculate expected payout for gift cards from admin rates
export async function calcGiftPayout(brand, country, faceUsd) {
  const docRef = doc(db, "giftCardRates", `${brand}__${country}`);
  const s = await getDoc(docRef);
  if (!s.exists()) return 0;
  const rate = Number(s.data()?.rateNgnPerUsd || 0);
  return Math.round(rate * Number(faceUsd));
}

// Calculate expected payout for online wallet (Chime/PayPal/Zelle/Venmo)
export async function calcWalletPayout(walletType, country, amountUsd) {
  const docRef = doc(db, "walletRates", `${walletType}__${country}`);
  const s = await getDoc(docRef);
  if (!s.exists()) return 0;
  const rate = Number(s.data()?.rateNgnPerUsd || 0);
  return Math.round(rate * Number(amountUsd));
}
</script>
