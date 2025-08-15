// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD-BIOpzkQBtpW1LQk7Rf3c-ZvyIbvEc7c",
  authDomain: "toolspay-54167.firebaseapp.com",
  projectId: "toolspay-54167",
  storageBucket: "toolspay-54167.firebasestorage.app",
  messagingSenderId: "71318117342",
  appId: "1:71318117342:web:1952711453e19e19281b4f"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ================= SIGN UP =================
export async function signUpUser(email, password, confirmPassword) {
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Redirect to profile page after sign up
    window.location.href = "profile.html";

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// ================= SIGN IN =================
export async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if profile exists
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      window.location.href = "customer-dashboard.html";
    } else {
      window.location.href = "profile.html";
    }

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// ================= SIGN OUT =================
export async function logOutUser() {
  await signOut(auth);
  window.location.href = "login.html";
}
