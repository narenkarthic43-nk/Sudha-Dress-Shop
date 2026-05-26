// ══════════════════════════════════════════════════════════════════
// SUDHA DRESS SHOP — ULTIMATE SYNC ENGINE (RESTORED ADMIN LOGIC)
// ══════════════════════════════════════════════════════════════════

// ── Initialize Firebase ──
let firebaseReady = false;
let auth = null;

try {
  if (firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('REPLACE') && !firebaseConfig.apiKey.includes('YOUR_')) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    firebaseReady = true;
    console.log('✅ Firebase Cloud services connected');
  } else {
    console.warn('⚠️ Firebase keys are placeholders. Please update firebase-config.js.');
  }
} catch (e) {
  console.warn('⚠️ Firebase initialization failed:', e.message);
}

// ── Local User Store ──
const STORE_KEY = 'sudha_users';
const SESSION_KEY = 'sudha_current_user';
const ADMIN_KEY = 'sudha_is_admin';

function getUsers() { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
function saveUsers(u) { localStorage.setItem(STORE_KEY, JSON.stringify(u)); }

window.addEventListener('DOMContentLoaded', () => {
    // Only connect to Google if Key is not a placeholder
    if (typeof GOOGLE_CLIENT_ID !== 'undefined' && GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('PASTE')) {
        initializeGSI();
    }
});

// 🟢 ROLE & TAB SWITCHING (Corrected for Opening Admin Portal)
function switchRole(role) {
    const customerSec = document.getElementById('customer-section');
    const adminSec = document.getElementById('admin-section');
    const roleCustomer = document.getElementById('role-customer');
    const roleAdmin = document.getElementById('role-admin');

    if (role === 'admin') {
        customerSec.style.display = 'none';
        adminSec.style.display = 'block';
        roleAdmin?.classList.add('active');
        roleCustomer?.classList.remove('active');
    } else {
        customerSec.style.display = 'block';
        adminSec.style.display = 'none';
        roleCustomer?.classList.add('active');
        roleAdmin?.classList.remove('active');
    }
}

function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    if (tab === 'login') {
        loginForm?.classList.add('active');
        registerForm?.classList.remove('active');
        tabLogin?.classList.add('active');
        tabRegister?.classList.remove('active');
    } else {
        registerForm?.classList.add('active');
        loginForm?.classList.remove('active');
        tabRegister?.classList.add('active');
        tabLogin?.classList.remove('active');
    }
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') { input.type = 'text'; icon.className = 'fas fa-eye-slash'; }
    else { input.type = 'password'; icon.className = 'fas fa-eye'; }
}

// ── CUSTOMER AUTH ──
function handleCustomerLogin(e) {
    e.preventDefault();
    const ident = document.getElementById('login-phone').value.trim();
    const pass = document.getElementById('login-password').value;
    const users = getUsers();
    const user = users.find(u => (u.phone === ident || u.email === ident) && u.password === pass);
    if (user) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, phone: user.phone, role: 'customer' }));
        window.location.href = 'index.html';
    } else { showMsg('login-error', '✕ Invalid credentials.', true); }
}

function handleCustomerRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    const users = getUsers();
    if (users.find(u => u.phone === phone)) { showMsg('register-error', '✕ Mobile already exists.', true); return; }
    users.push({ name, phone, email, password: pass });
    saveUsers(users);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, phone, role: 'customer' }));
    window.location.href = 'index.html';
}

// ── ADMIN AUTH — Corrected to Open the Admin Portal ──
async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-password').value;
    const btn = document.getElementById('btn-admin-submit');
    btn.innerHTML = '⏳ Verifying...';

    const ownerEmail = (typeof ADMIN_EMAIL !== 'undefined') ? ADMIN_EMAIL : 'narenkarthic34@gmail.com';
    const correctOffline = (typeof ADMIN_OFFLINE_PASS !== 'undefined') ? ADMIN_OFFLINE_PASS : 'Naren@2007';

    // 1. Prioritize offline check if email and password match local admin constants
    if (email.toLowerCase() === ownerEmail.toLowerCase() && pass === correctOffline) {
        sessionStorage.setItem(ADMIN_KEY, 'true');
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: 'Owner', email, role: 'admin' }));
        window.location.href = 'admin.html';
        return;
    }

    // 2. Otherwise try Firebase if configured
    if (firebaseReady && auth) {
        try {
            await auth.signInWithEmailAndPassword(email, pass);
            if (email.toLowerCase() === ownerEmail.toLowerCase()) {
                sessionStorage.setItem(ADMIN_KEY, 'true');
                sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: 'Owner', email, role: 'admin' }));
                window.location.href = 'admin.html';
                return;
            } else {
                showMsg('admin-error', '✕ Access Denied: Not the Store Owner.', true);
            }
        } catch (err) {
            showMsg('admin-error', '✕ Admin Login Failed. Check credentials.', true);
        }
    } else {
        showMsg('admin-error', '✕ Incorrect Email or Password.', true);
    }
    btn.innerHTML = '<i class="fas fa-shield-alt"></i> Access Admin Panel';
}

// ── GOOGLE SYNC ──
function initializeGSI() {
    if (typeof google === 'undefined') return;
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGSICallback, auto_select: true });
    google.accounts.id.prompt();
    google.accounts.id.renderButton(document.getElementById('google-btn-customer'), { theme: 'outline', size: 'large', shape: 'pill', width: 320 });
    google.accounts.id.renderButton(document.getElementById('google-btn-admin'), { theme: 'outline', size: 'large', shape: 'pill', width: 320 });
}

async function handleGSICallback(response) {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    handleGoogleSuccess(payload, 'customer');
}

async function handleGoogleLogin(role = 'customer') {
    if (!firebaseReady) { showMsg('login-error', 'ℹ️ Firebase Keys Missing in firebase-config.js', true); return; }
    try {
        const result = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        handleGoogleSuccess(result.user, role);
    } catch (err) { showMsg('login-error', '✕ Google login window closed.', true); }
}

async function handleGoogleSuccess(gUser, role) {
    if (role === 'admin') {
        const ownerEmail = (typeof ADMIN_EMAIL !== 'undefined') ? ADMIN_EMAIL : 'narenkarthic34@gmail.com';
        if (gUser.email.toLowerCase() === ownerEmail.toLowerCase()) {
            sessionStorage.setItem(ADMIN_KEY, 'true');
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: 'Owner', email: gUser.email, role: 'admin' }));
            window.location.href = 'admin.html';
        } else { showMsg('admin-error', '✕ Account unauthorized.', true); }
        return;
    }
    const users = getUsers();
    const existing = users.find(u => u.email === gUser.email);
    if (existing) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: existing.name, email: existing.email, phone: existing.phone, role: 'customer' }));
        window.location.href = 'index.html';
    } else {
        pendingGoogleUser = { name: gUser.displayName || gUser.name, email: gUser.email };
        document.getElementById('google-profile-modal').classList.add('active');
    }
}

function saveGooglePhoneNumber() {
    const phone = document.getElementById('google-phone').value.trim();
    if (phone.length < 10) { alert('Enter valid WhatsApp.'); return; }
    const newUser = { ...pendingGoogleUser, phone, createdAt: new Date().toISOString() };
    const users = getUsers(); users.push(newUser); saveUsers(users);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: newUser.name, phone: newUser.phone, role: 'customer' }));
    window.location.href = 'index.html';
}

function showMsg(id, msg, isError = false) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); el.style.color = isError ? '#f87171' : '#4ade80'; }
}

// ── FORGOT PASSWORD (OTP UI & WHATSAPP LOGIC) ──
let generatedOTP = null;
let resetUserPhone = null;

function openForgotModal(e) { 
    if (e) e.preventDefault();
    document.getElementById('forgot-modal-overlay').classList.add('active'); 
    switchForgotStep(1);
    const msg = document.getElementById('reset-msg-step1');
    if(msg) { msg.textContent = ''; msg.classList.remove('show'); }
}

function closeForgotModal() { 
    document.getElementById('forgot-modal-overlay').classList.remove('active'); 
}

function switchForgotStep(s) { 
    [1,2,3].forEach(n => {
        const el = document.getElementById(`forgot-step-${n}`);
        if(el) el.style.display = n === s ? 'block' : 'none';
    });
}

function sendOTPRequest() {
    const rawPhone = document.getElementById('forgot-id').value.trim();
    if (!rawPhone) { showMsg('reset-msg-step1', '✕ Enter WhatsApp number.', true); return; }

    const phone = rawPhone.replace(/[^0-9]/g, ''); // Clean to digits only
    if (phone.length < 10) { showMsg('reset-msg-step1', '✕ Enter valid number.', true); return; }

    // Check if user exists by phone
    const users = getUsers();
    const user = users.find(u => u.phone && u.phone.replace(/[^0-9]/g, '') === phone);

    if (!user) {
        showMsg('reset-msg-step1', '✕ User not found with this number.', true);
        return;
    }

    // Generate 6 digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    resetUserPhone = user.phone;

    // Show message and redirect to WhatsApp
    showMsg('reset-msg-step1', '✓ Opening WhatsApp to receive OTP...');
    
    // Message to be "received" by the user in their own chat (works as it's a direct wa.me link)
    const waMsg = `👗 *Sudha Dress Shop — Password Reset*\n\nYour One-Time Password (OTP) for password reset is: *${generatedOTP}*\n\nPlease enter this on the website to set a new password.`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`;
    
    // Open in 1.5 seconds so user sees the message
    setTimeout(() => {
        window.open(waUrl, '_blank');
        switchForgotStep(2);
    }, 1500);
}

function verifyOTPRequest() {
    const entered = document.getElementById('forgot-otp').value.trim();
    if (entered === generatedOTP) {
        showMsg('reset-msg-step2', '✓ Verified Successfully.');
        setTimeout(() => switchForgotStep(3), 1000);
    } else {
        showMsg('reset-msg-step2', '✕ Incorrect OTP. Try again.', true);
    }
}

function resetPasswordFinal() {
    const pass1 = document.getElementById('forgot-new-pass').value;
    const pass2 = document.getElementById('forgot-confirm-pass').value;

    if (!pass1 || pass1.length < 4) { showMsg('reset-msg-step3', '✕ Password must be 4+ chars.', true); return; }
    if (pass1 !== pass2) { showMsg('reset-msg-step3', '✕ Passwords do not match.', true); return; }

    const users = getUsers();
    const idx = users.findIndex(u => u.phone === resetUserPhone);

    if (idx !== -1) {
        users[idx].password = pass1;
        saveUsers(users);
        showMsg('reset-msg-step3', '✓ Password Reset Successfully!');
        setTimeout(closeForgotModal, 1500);
    } else {
        showMsg('reset-msg-step3', '✕ Reset error. Try again.', true);
    }
}
