import { signInWithEmailAndPassword, auth } from './firebase-auth.js';

// Get login form elements
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loader = document.getElementById('loginLoader');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get email and password values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Show loader
    if (loader) loader.style.display = 'block';
    if (loginError) loginError.textContent = '';

    try {
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(email, password);

      // Show success loader for 2.5 seconds
      if (loader) loader.innerHTML = `<p style="color:green;">Login successful! Redirecting...</p>`;
      setTimeout(() => {
        window.location.href = 'customer-dashboard.html'; // Change to your customer dashboard page
      }, 2500);

    } catch (error) {
      console.error('Login failed:', error);
      if (loginError) loginError.textContent = error.message;
      if (loader) loader.style.display = 'none';
    }
  });
}
