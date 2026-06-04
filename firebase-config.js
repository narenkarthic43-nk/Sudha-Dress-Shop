// ══════════════════════════════════════════════════════════════════
// SUDHA DRESS SHOP — CLOUD & SYNC CONFIGURATION (PERFECT CONFIG)
// ══════════════════════════════════════════════════════════════════

// ── STEP 1: JSONBlob Sync (Primary) ──
const JSONBLOB_ID = '019e9090-c397-7a7c-9929-b054ac7db593';

// ── STEP 2: ImgBB API Key ──
const IMGBB_API_KEY = 'YOUR_KEY_HERE';

// ── STEP 3: REAL FIREBASE KEYS (REQUIRED FOR GOOGLE LOGIN) ──
// Get these from: https://console.firebase.google.com
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "sudha-dress-shop.firebaseapp.com",
};

// ── STEP 4: GOOGLE CLIENT ID ──
// Get this from: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';

// Initialize Firebase (Compat mode)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Google Login Function (Used by login.html)
async function googleLogin() {
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const user = result.user;
    console.log("✅ Login Success:", user.displayName);

    // Save to session for admin.js / script.js to pick up
    const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    sessionStorage.setItem('sudha_current_user', JSON.stringify({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      role: isAdmin ? 'admin' : 'customer'
    }));

    if (isAdmin) {
      sessionStorage.setItem('sudha_is_admin', 'true');
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("❌ Login failed: ", error.message);
    alert("Login failed: " + error.message);
  }
}

// ── STEP 5: Admin Credentials ──
const ADMIN_EMAIL = 'narenkarthic34@gmail.com';
const ADMIN_OFFLINE_PASS = 'Naren@2007';

// ── STEP 6: Image Upload Mode ──
// Options: 
//   - 'browser' : Saves in browser (IndexedDB) and syncs as base64. No server/cloud account needed.
//   - 'cloud'   : Uploads directly to Cloud (ImgBB / FreeImage.host). Required for Vercel/live hosting.
//   - 'local'   : Saves images to local uploads/ folder. Requires 'node server.js' to be running.
//   - 'auto'    : Attempts local server upload first, falls back to cloud/browser.
const UPLOAD_MODE = 'browser';




