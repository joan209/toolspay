// DOM Elements
const authButton = document.getElementById("auth-button");
const toggleAuth = document.getElementById("toggle-auth");
const formTitle = document.getElementById("form-title");

let isLogin = true; // Toggle state

// Toggle Login / Signup UI
toggleAuth.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  authButton.textContent = isLogin ? "Login" : "Sign Up";
  toggleAuth.textContent = isLogin
    ? "Don't have an account? Sign up"
    : "Already have an account? Login";
});

// Handle Auth Button Click
authButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    if (isLogin) {
      // LOGIN
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }
      
      window.location.href = "customer-dashboard.html";
    } else {
      // SIGN UP
      const refCode = new URLSearchParams(window.location.search).get("ref") || null;
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      await user.sendEmailVerification();
      alert("Signup successful! Please verify your email before logging in.");

      // Store user data in Firestore
      const userDoc = {
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        balance: 0,
        referralCode: user.uid.substring(0, 8), // simple code
        referredBy: refCode,
        hasTraded: false
      };

      await firebase.firestore().collection("customers").doc(user.uid).set(userDoc);
    }
  } catch (error) {
    alert(error.message);
  }
});

// Referral Bonus Logic
firebase.firestore().collection("trades").onSnapshot(async (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "added") {
      const trade = change.doc.data();
      if (trade.status === "completed" && trade.userId) {
        const userDoc = await firebase.firestore().collection("customers").doc(trade.userId).get();
        const referredBy = userDoc.data()?.referredBy;
        
        if (referredBy) {
          const refUserRef = firebase.firestore().collection("customers").doc(referredBy);
          await firebase.firestore().runTransaction(async (transaction) => {
            const refUserDoc = await transaction.get(refUserRef);
            if (refUserDoc.exists) {
              const newBalance = (refUserDoc.data().balance || 0) + 1000;
              transaction.update(refUserRef, { balance: newBalance });
            }
          });
        }
      }
    }
  });
});
