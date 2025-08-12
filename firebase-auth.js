// firebase-auth.js
// Central Firebase init + helpers used by frontend pages (import from modules)

// Firebase modular SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  signOut as _signOut,
  onAuthStateChanged as _onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

/* ====== YOUR FIREBASE CONFIG (you pasted earlier) ====== */
const firebaseConfig = {
  apiKey: "AIzaSyAs_YwDtcTLojVFnrs9kUIYN1KT_BWEoEo",
  authDomain: "toolspay-b2aab.firebaseapp.com",
  projectId: "toolspay-b2aab",
  storageBucket: "toolspay-b2aab.firebasestorage.app",
  messagingSenderId: "812183091284",
  appId: "1:812183091284:web:f46fb99e912154acb4d5c1"
};
/* ================================================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* ---------- AUTH wrapper helpers (exported) ---------- */
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
  return _onAuthStateChanged(auth, cb);
}

/* ---------- Firestore + Storage helpers ---------- */
async function saveUserProfile(uid, profile) {
  const uref = doc(db, 'users', uid);
  await setDoc(uref, { ...profile, createdAt: serverTimestamp() }, { merge: true });
}

async function createTradeRequest(data) {
  // expected data: { uid, email, name, service, cardId, countryCode, usd, bankDetails, uploadFile (optional File object), cryptoTxId (optional) }
  const reqRef = await addDoc(collection(db, 'requests'), {
    uid: data.uid,
    email: data.email,
    name: data.name || null,
    service: data.service || null,
    cardId: data.cardId || null,
    countryCode: data.countryCode || null,
    usd: Number(data.usd || 0),
    bankDetails: data.bankDetails || null,
    cryptoTxId: data.cryptoTxId || null,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  // if there's a file upload, upload it and attach url
  if (data.uploadFile) {
    const fRef = storageRef(storage, `requests/${reqRef.id}/upload-${Date.now()}`);
    await uploadBytes(fRef, data.uploadFile);
    const url = await getDownloadURL(fRef);
    await updateDoc(doc(db, 'requests', reqRef.id), { uploadUrl: url });
  }

  return reqRef.id;
}

async function uploadChatImage(file, chatId) {
  const key = `chat-uploads/${chatId || 'unknown'}-${Date.now()}`;
  const r = storageRef(storage, key);
  await uploadBytes(r, file);
  return await getDownloadURL(r);
}

async function saveRates(payload) {
  await setDoc(doc(db, 'rates', 'default'), payload, { merge: true });
}

async function getRatesDoc() {
  const r = await getDoc(doc(db, 'rates', 'default'));
  return r.exists() ? r.data() : null;
}

async function listGiftcards() {
  const snap = await getDocs(collection(db, 'giftcards'));
  const out = [];
  snap.forEach(s => { out.push({ id: s.id, ...s.data() }); });
  return out;
}
async function getGiftcard(id) {
  const s = await getDoc(doc(db, 'giftcards', id));
  return s.exists() ? s.data() : null;
}

async function saveGiftcard(id, payload, logoFile) {
  let logoUrl = payload.logoUrl || null;
  if (logoFile) {
    const fRef = storageRef(storage, `giftcard-logos/${id}-${Date.now()}`);
    await uploadBytes(fRef, logoFile);
    logoUrl = await getDownloadURL(fRef);
  }
  await setDoc(doc(db, 'giftcards', id), { ...payload, logoUrl }, { merge: true });
}

async function addAdminByEmail(email) {
  await setDoc(doc(db, 'admins', email), { createdAt: serverTimestamp() });
}

async function createChatThread(requestId, participants = []) {
  const docRef = await addDoc(collection(db, 'chats'), {
    requestId: requestId || null,
    participants,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function postChatMessage(chatId, senderUid, senderEmail, text, imageUrl = null) {
  const msg = {
    chatId, senderUid, senderEmail, text: text || null, imageUrl: imageUrl || null, createdAt: serverTimestamp()
  };
  const docRef = await addDoc(collection(db, `chats/${chatId}/messages`), msg);
  return docRef.id;
}

/* ---------- Export everything front-end pages will need ---------- */
export {
  auth, db, storage,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged,
  saveUserProfile, createTradeRequest, uploadChatImage, saveRates, getRatesDoc,
  listGiftcards, getGiftcard, saveGiftcard, addAdminByEmail,
  createChatThread, postChatMessage, getDoc, getDocs, collection, doc, updateDoc, query, where, onSnapshot
};
