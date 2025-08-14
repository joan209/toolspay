// customer-auth.js
// Lightweight auth modal (Sign In / Sign Up / Forgot) for customers

import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  db,
  doc,
  getDoc,
  setDoc
} from './firebase.js';

const authMount = document.getElementById('authMount');
const openAuthBtn = document.getElementById('openAuthBtn');
const logoutBtn = document.getElementById('logoutBtn');
const splash = document.getElementById('splash');

function html(strings, ...vals){ return strings.map((s,i)=>s+(vals[i]??'')).join(''); }

function openModal(tab='signin'){
  authMount.classList.remove('hidden');
  authMount.innerHTML = html`
    <div class="modal-backdrop">
      <div class="modal">
        <div class="flex" style="justify-content:space-between">
          <h3>Welcome to Toolspay</h3>
          <button id="closeAuth" class="btn-ghost">Close</button>
        </div>

        <div class="tabs" style="margin-top:10px">
          <div id="tabSignIn" class="tab ${tab==='signin'?'active':''}">Sign in</div>
          <div id="tabSignUp" class="tab ${tab==='signup'?'active':''}">Create account</div>
          <div id="tabForgot" class="tab ${tab==='forgot'?'active':''}">Forgot password</div>
        </div>

        <div id="viewSignIn" style="${tab==='signin'?'':'display:none'}">
          <label>Email</label>
          <input id="siEmail" type="email" placeholder="you@example.com">
          <label style="margin-top:8px">Password</label>
          <input id="siPass" type="password" placeholder="••••••••">
          <div class="flex" style="margin-top:10px">
            <button id="btnSignIn" class="btn-primary">Sign in</button>
            <span id="siMsg" class="muted"></span>
          </div>
        </div>

        <div id="viewSignUp" style="${tab==='signup'?'':'display:none'}">
          <div class="row row-2">
            <div>
              <label>Full name</label>
              <input id="suName" placeholder="Your name">
            </div>
            <div>
              <label>Referral (optional)</label>
              <input id="suRef" placeholder="Referral code (email or code)">
            </div>
          </div>
          <label style="margin-top:8px">Email</label>
          <input id="suEmail" type="email" placeholder="you@example.com">
          <label style="margin-top:8px">Password</label>
          <input id="suPass" type="password" placeholder="Min 6 characters">
          <div class="flex" style="margin-top:10px">
            <button id="btnSignUp" class="btn-primary">Create account</button>
            <span id="suMsg" class="muted"></span>
          </div>
        </div>

        <div id="viewForgot" style="${tab==='forgot'?'':'display:none'}">
          <label>Email</label>
          <input id="fgEmail" type="email" placeholder="you@example.com">
          <div class="flex" style="margin-top:10px">
            <button id="btnForgot" class="btn-primary">Send reset link</button>
            <span id="fgMsg" class="muted"></span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('closeAuth').onclick = closeModal;
  document.getElementById('tabSignIn').onclick = ()=>openModal('signin');
  document.getElementById('tabSignUp').onclick = ()=>openModal('signup');
  document.getElementById('tabForgot').onclick = ()=>openModal('forgot');

  const siMsg = document.getElementById('siMsg');
  const suMsg = document.getElementById('suMsg');
  const fgMsg = document.getElementById('fgMsg');

  const btnSignIn = document.getElementById('btnSignIn');
  if (btnSignIn) btnSignIn.onclick = async ()=>{
    siMsg.textContent = 'Signing in...';
    try{
      const em = document.getElementById('siEmail').value.trim();
      const pw = document.getElementById('siPass').value;
      await signInWithEmailAndPassword(auth, em, pw);
      siMsg.textContent = 'Done ✓';
      closeModal();
    }catch(e){ siMsg.textContent = e.message || e.code; }
  };

  const btnSignUp = document.getElementById('btnSignUp');
  if (btnSignUp) btnSignUp.onclick = async ()=>{
    suMsg.textContent = 'Creating...';
    try{
      const name = document.getElementById('suName').value.trim();
      const ref  = document.getElementById('suRef').value.trim() || null;
      const em = document.getElementById('suEmail').value.trim();
      const pw = document.getElementById('suPass').value;

      const cred = await createUserWithEmailAndPassword(auth, em, pw);
      // create user profile doc
      await setDoc(doc(db,'users',cred.user.uid), {
        name, email: em, createdAt: Date.now(),
        bank: { bankName:'', acctNo:'', acctName:'' },
        balance: 0,
        referral: ref,
      }, { merge:true });

      try { await sendEmailVerification(cred.user); } catch{}
      suMsg.textContent = 'Account created ✓ Check email to verify.';
      setTimeout(closeModal, 800);
    }catch(e){ suMsg.textContent = e.message || e.code; }
  };

  const btnForgot = document.getElementById('btnForgot');
  if (btnForgot) btnForgot.onclick = async ()=>{
    fgMsg.textContent = 'Sending...';
    try{
      const em = document.getElementById('fgEmail').value.trim();
      await sendPasswordResetEmail(auth, em);
      fgMsg.textContent = 'Reset link sent ✓';
    }catch(e){ fgMsg.textContent = e.message || e.code; }
  };
}

function closeModal(){
  authMount.classList.add('hidden');
  authMount.innerHTML = '';
}

openAuthBtn?.addEventListener('click', ()=>openModal('signin'));

logoutBtn?.addEventListener('click', async ()=>{
  await signOut(auth);
  location.reload();
});

// Theme toggle
const themeBtn = document.getElementById('themeBtn');
themeBtn?.addEventListener('click', ()=>{
  const html = document.documentElement;
  html.setAttribute('data-theme', html.getAttribute('data-theme')==='dark' ? 'light' : 'dark');
});

// Initial auth check (hide splash after we know)
onAuthStateChanged(auth, async (user)=>{
  try{
    if (user) {
      // Ensure profile doc exists
      const uref = doc(db,'users',user.uid);
      const snap = await getDoc(uref);
      if (!snap.exists()) {
        await setDoc(uref, {
          email: user.email || '',
          createdAt: Date.now(),
          bank: { bankName:'', acctNo:'', acctName:'' },
          balance: 0
        }, { merge:true });
      }
      document.getElementById('openAuthBtn')?.classList.add('hidden');
      document.getElementById('logoutBtn')?.classList.remove('hidden');
    } else {
      document.getElementById('openAuthBtn')?.classList.remove('hidden');
      document.getElementById('logoutBtn')?.classList.add('hidden');
    }
  } finally {
    // Small delay so splash feels smooth
    setTimeout(()=> splash?.classList.add('hidden'), 600);
  }
});
