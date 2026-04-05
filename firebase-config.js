// ══════════════════════════════════════════════════════════════════
// SUDHA DRESS SHOP — CLOUD SYNC CONFIGURATION
// ══════════════════════════════════════════════════════════════════
//
// WE ARE NOW USING JSONBLOB FOR AUTO SYNC ACROSS DEVICES!
// No API keys are required anymore. Images will be automatically
// compressed and synced to all devices using this JSONBLOB_ID.
//
// ══════════════════════════════════════════════════════════════════

// ── JSONBlob Auto-Sync Database (Free, No Auth Required) ──
const JSONBLOB_ID = '019d5a1c-d520-78f1-bb62-2818a32a97d5';

// ── STEP 1: ImgBB (Free Image Hosting - REQUIRED FOR WHATSAPP PREVIEWS) ──
// Get FREE key instantly at: https://api.imgbb.com (Takes 30 seconds)
// This generates public links for your images so they show natively in WhatsApp.
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY_HERE';

// ── (Optional) Firebase — for advanced users only ──
// Skip this if you're using JSONBlob above
const firebaseConfig = {
  apiKey: 'AIzaSyABC123_REPLACE_WITH_YOUR_KEY',
  authDomain: 'sudha-dress-shop.firebaseapp.com',
  databaseURL: 'https://sudha-dress-shop-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'sudha-dress-shop',
  storageBucket: 'sudha-dress-shop.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef'
};

// ── Admin Credentials ──
const ADMIN_EMAIL = 'narenkarthic34@gmail.com';
const ADMIN_OFFLINE_PASS = 'Sudha@2026';

// ── Sync Mode (auto-detected, don't change) ──
const OFFLINE_MODE = true;
