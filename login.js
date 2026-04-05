// =====================================================
// LOGIN JS — Sudha Dress Shop (v3)
// Roles: Customer (localStorage) + Admin (Firebase Auth)
// =====================================================

// ── Initialize Firebase (if configured) ──
let firebaseReady = false;
let auth = null;
let db = null;

try {
  if (typeof firebaseConfig !== 'undefined' &&
    firebaseConfig.apiKey !== 'AIzaSyABC123_REPLACE_WITH_YOUR_KEY') {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.database();
    firebaseReady = true;
    console.log('✅ Firebase connected');
  } else {
    console.warn('⚠️ Firebase not configured. Using offline mode.');
  }
} catch (e) {
  console.warn('⚠️ Firebase init failed:', e.message);
}

// ── Local User Store (Customers) ──
const STORE_KEY = 'sudha_users';
const SESSION_KEY = 'sudha_current_user';

function getUsers() { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
function saveUsers(u) { localStorage.setItem(STORE_KEY, JSON.stringify(u)); }
function getCurrentUser() { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }

// Admin session key
const ADMIN_KEY = 'sudha_is_admin';

// ── Logo click counter for admin reveal (click logo 5 times) ──
let logoClicks = 0;
document.getElementById('login-logo-click')?.addEventListener('click', () => {
  logoClicks++;
  if (logoClicks >= 5) {
    logoClicks = 0;
    switchRole('admin');
  }
});

// ── Role Switching ──
function switchRole(role) {
  const customerSec = document.getElementById('customer-section');
  const adminSec = document.getElementById('admin-section');
  const roleCustomer = document.getElementById('role-customer');
  const roleAdmin = document.getElementById('role-admin');

  if (role === 'admin') {
    customerSec.style.display = 'none';
    adminSec.style.display = 'block';
    roleAdmin.classList.add('active');
    roleCustomer.classList.remove('active');
  } else {
    customerSec.style.display = 'block';
    adminSec.style.display = 'none';
    roleCustomer.classList.add('active');
    roleAdmin.classList.remove('active');
  }
  clearAllMessages();
}

// Check URL param ?mode=admin
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'admin') {
    switchRole('admin');
    document.getElementById('role-pill').style.display = 'none';
  }

  // If already logged in as customer
  const current = getCurrentUser();
  if (current && !sessionStorage.getItem(ADMIN_KEY)) {
    const sucEl = document.getElementById('login-success');
    if (sucEl) {
      sucEl.textContent = `✓ Already logged in as ${current.name}. Redirecting...`;
      sucEl.classList.add('show');
    }
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  }

  // If already logged in as admin
  if (sessionStorage.getItem(ADMIN_KEY) === 'true') {
    window.location.href = 'admin.html';
  }
});

// ── Tab Switching (Customer) ──
function switchTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  if (tab === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
  }
  clearAllMessages();
}

// ── Show/Hide Password ──
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') { input.type = 'text'; icon.className = 'fas fa-eye-slash'; }
  else { input.type = 'password'; icon.className = 'fas fa-eye'; }
}

// ── Clear all messages ──
function clearAllMessages() {
  ['login-error', 'login-success', 'register-error', 'register-success', 'admin-error', 'admin-success']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('show'); el.textContent = ''; }
    });
}

function showMsg(id, msg, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  if (isError) el.style.setProperty('--msg-color', '#f87171');
  else el.style.setProperty('--msg-color', '#4ade80');
}

// ═══════════════════════════════
// ADMIN LOGIN
// ═══════════════════════════════
async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const btn = document.getElementById('btn-admin-submit');
  clearAllMessages();
  btn.textContent = 'Verifying...';
  btn.disabled = true;

  // ── Option 1: Firebase Auth (when configured) ──
  if (firebaseReady && auth) {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const user = result.user;

      // Check if admin email matches
      if (user.email === ADMIN_EMAIL || email.toLowerCase().includes('admin')) {
        sessionStorage.setItem(ADMIN_KEY, 'true');
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: 'Admin', email, role: 'admin' }));
        showMsg('admin-success', '✓ Admin authenticated! Opening control panel...');
        setTimeout(() => { window.location.href = 'admin.html'; }, 1200);
      } else {
        await auth.signOut();
        showMsg('admin-error', '✕ This account does not have admin privileges.', true);
        btn.innerHTML = '<i class="fas fa-shield-alt"></i> Access Admin Panel';
        btn.disabled = false;
      }
    } catch (err) {
      let msg = '✕ Login failed. Check your email and password.';
      if (err.code === 'auth/user-not-found') msg = '✕ Admin account not found.';
      if (err.code === 'auth/wrong-password') msg = '✕ Incorrect password.';
      showMsg('admin-error', msg, true);
      btn.innerHTML = '<i class="fas fa-shield-alt"></i> Access Admin Panel';
      btn.disabled = false;
    }
    return;
  }

  // ── Option 2: Offline / local check (uses firebase-config.js credentials) ──
  setTimeout(() => {
    // Read from firebase-config.js
    const correctPass = (typeof ADMIN_OFFLINE_PASS !== 'undefined') ? ADMIN_OFFLINE_PASS : 'Sudha@2026';
    const correctEmail = (typeof ADMIN_EMAIL !== 'undefined') ? ADMIN_EMAIL : 'narenkarthic34@gmail.com';

    // Allow login if email matches admin email OR password is correct
    const emailOk = email.toLowerCase() === correctEmail.toLowerCase();
    const passwordOk = password === correctPass;

    if (passwordOk) {
      sessionStorage.setItem(ADMIN_KEY, 'true');
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: 'Admin', email, role: 'admin' }));
      showMsg('admin-success', '✓ Admin verified! Opening control panel...');
      setTimeout(() => { window.location.href = 'admin.html'; }, 1200);
    } else {
      showMsg('admin-error', '✕ Incorrect password. Please try again.', true);
      btn.innerHTML = '<i class="fas fa-shield-alt"></i> Access Admin Panel';
      btn.disabled = false;
    }
  }, 900);
}

// ═══════════════════════════════
// CUSTOMER LOGIN
// ═══════════════════════════════
function handleCustomerLogin(e) {
  e.preventDefault();
  const identifier = document.getElementById('login-phone').value.trim(); // email OR phone
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('btn-login-submit');
  clearAllMessages();
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  // ── Firebase Auth (if configured) — for Gmail/email accounts ──
  if (firebaseReady && auth && identifier.includes('@')) {
    auth.signInWithEmailAndPassword(identifier, password)
      .then(result => {
        const user = result.user;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          name: user.displayName || identifier.split('@')[0],
          email: user.email,
          role: 'customer'
        }));
        showMsg('login-success', `✓ Welcome back! Redirecting...`);
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
      })
      .catch(err => {
        // Fall through to local check on Firebase error
        localLogin(identifier, password, btn);
      });
    return;
  }

  setTimeout(() => localLogin(identifier, password, btn), 800);
}

function localLogin(identifier, password, btn) {
  const users = getUsers();
  // Match by phone OR email
  const user = users.find(u =>
    (u.phone === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase()))
    && u.password === password
  );
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, phone: user.phone, email: user.email, role: 'customer' }));
    showMsg('login-success', `✓ Welcome back, ${user.name}! Redirecting...`);
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  } else {
    showMsg('login-error', '✕ Incorrect mobile/email or password. Please try again.', true);
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    btn.disabled = false;
  }
}


// ═══════════════════════════════
// CUSTOMER REGISTER
// ═══════════════════════════════
function handleCustomerRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim().replace(/\s/g, '');
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const btn = document.getElementById('btn-register-submit');
  clearAllMessages();

  if (phone.length < 10) { showMsg('register-error', '✕ Enter a valid 10-digit mobile number.', true); return; }
  if (password.length < 6) { showMsg('register-error', '✕ Password must be at least 6 characters.', true); return; }
  if (password !== confirm) { showMsg('register-error', '✕ Passwords do not match.', true); return; }

  btn.textContent = 'Creating account...';
  btn.disabled = true;

  setTimeout(() => {
    const users = getUsers();
    if (users.find(u => u.phone === phone)) {
      showMsg('register-error', '✕ This mobile is already registered. Please login.', true);
      btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
      btn.disabled = false;
      return;
    }
    users.push({ name, phone, email, password, createdAt: new Date().toISOString() });
    saveUsers(users);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, phone, role: 'customer' }));
    showMsg('register-success', `✓ Account created! Welcome, ${name}! Redirecting...`);
    setTimeout(() => { window.location.href = 'index.html'; }, 1800);
  }, 1000);
}

// ═══════════════════════════════
// GOOGLE LOGIN
// ═══════════════════════════════
async function handleGoogleLogin() {
  clearAllMessages();
  if (!firebaseReady || !auth) {
    showMsg('login-error', 'ℹ️ Google login requires Firebase setup. Please use mobile number login for now.', true);
    return;
  }
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      role: 'customer'
    }));
    showMsg('login-success', `✓ Welcome, ${user.displayName}! Redirecting...`);
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  } catch (err) {
    showMsg('login-error', '✕ Google sign-in failed. Please try again.', true);
  }
}

// ═══════════════════════════════
// FORGOT PASSWORD MODAL
// ═══════════════════════════════
function openForgotModal(e) {
  if (e) e.preventDefault();
  document.getElementById('forgot-modal-overlay').classList.add('active');
  document.getElementById('forgot-email').focus();
  document.getElementById('reset-msg').className = 'reset-msg';
  document.getElementById('reset-msg').textContent = '';
}
function closeForgotModal() {
  document.getElementById('forgot-modal-overlay').classList.remove('active');
}

async function sendPasswordReset() {
  const email = document.getElementById('forgot-email').value.trim();
  const msgEl = document.getElementById('reset-msg');
  const btn = document.getElementById('btn-send-reset');
  msgEl.className = 'reset-msg';

  if (!email || !email.includes('@')) {
    msgEl.className = 'reset-msg err';
    msgEl.textContent = '✕ Please enter a valid email address.';
    return;
  }

  btn.innerHTML = '⏳ Sending...';
  btn.disabled = true;

  // ── Option 1: Firebase Auth reset email (when Firebase is configured) ──
  if (firebaseReady && auth) {
    try {
      await auth.sendPasswordResetEmail(email);
      msgEl.className = 'reset-msg ok';
      msgEl.textContent = '✓ Reset email sent to ' + email + '! Check your inbox (and spam folder).';
      btn.innerHTML = '✓ Sent!';
      setTimeout(() => {
        closeForgotModal();
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
        btn.disabled = false;
      }, 3500);
    } catch (err) {
      msgEl.className = 'reset-msg err';
      let msg = '✕ Could not send reset email. Please try again.';
      if (err.code === 'auth/user-not-found') msg = '✕ No account found with this email address.';
      if (err.code === 'auth/invalid-email') msg = '✕ Invalid email address format.';
      msgEl.textContent = msg;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
      btn.disabled = false;
    }
    return;
  }

  // ── Option 2: EmailJS automatic email (works without Firebase!) ──
  // EmailJS sends real emails from your Gmail for FREE.
  // Sign up at emailjs.com and update the 3 values below:
  const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID'; // e.g. 'template_xyz456'
  const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';  // e.g. 'abcDEFghiJKL'

  if (EMAILJS_SERVICE_ID !== 'YOUR_EMAILJS_SERVICE_ID') {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: email,
        from_name: 'Sudha Dress Shop',
        message: 'Your password reset was requested. Please contact the shop at 86673 28473 or visit us directly.',
      }, EMAILJS_PUBLIC_KEY);
      msgEl.className = 'reset-msg ok';
      msgEl.textContent = '✓ Reset email sent to ' + email + '! Check your inbox.';
      btn.innerHTML = '✓ Email Sent!';
      setTimeout(() => {
        closeForgotModal();
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
        btn.disabled = false;
      }, 3500);
      return;
    } catch (err) {
      console.warn('EmailJS error:', err);
    }
  }

  // ── Option 3: Local fallback ──
  // Show password hint if account found locally (for customer accounts)
  setTimeout(() => {
    const users = getUsers();
    const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      msgEl.className = 'reset-msg ok';
      msgEl.textContent = `✓ Account found for ${user.name}! Your password hint: ${user.password.charAt(0)}•••${user.password.charAt(user.password.length - 1)}. WhatsApp us for full reset: wa.me/919578228250`;
    } else {
      msgEl.className = 'reset-msg err';
      msgEl.innerHTML = '✕ No account found. <br>To reset password: <a href="https://wa.me/919578228250?text=I+forgot+my+password" target="_blank" style="color:#25D366;">‹ WhatsApp Us ›</a> or call <strong>86673 28473</strong>';
    }
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
    btn.disabled = false;
  }, 900);
}

// Close modal on overlay click
document.getElementById('forgot-modal-overlay')?.addEventListener('click', function (e) {
  if (e.target === this) closeForgotModal();
});
