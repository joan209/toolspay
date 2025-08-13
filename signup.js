import { createUserWithEmailAndPassword, sendEmailVerification, auth } from './firebase-auth.js';

const signupForm = document.getElementById('signupForm');
const signupError = document.getElementById('signupError');
const signupLoader = document.getElementById('signupLoader');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      signupError.textContent = 'Passwords do not match!';
      return;
    }

    try {
      signupLoader.style.display = 'block';
      signupError.textContent = '';

      // Create the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Send verification email
      await sendEmailVerification(userCredential.user);

      signupLoader.innerHTML = `<p style="color:green;">Account created! Please check your email to verify before logging in.</p>`;

    } catch (error) {
      console.error('Signup failed:', error);
      signupError.textContent = error.message;
      signupLoader.style.display = 'none';
    }
  });
}
