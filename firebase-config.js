// ══════════════════════════════════════════════════════════════════
// SUDHA DRESS SHOP — CLOUD SYNC CONFIGURATION
// ══════════════════════════════════════════════════════════════════
//
// HOW TO ENABLE IMAGE SYNC ACROSS ALL DEVICES (FREE — 5 MINUTES):
//
// ┌─────────────────────────────────────────────────────────────┐
// │  STEP 1: GET FREE IMAGE HOSTING (ImgBB)                     │
// │  1. Open: https://imgbb.com                                  │
// │  2. Sign up (free) OR sign in with Google                    │
// │  3. Go to: https://api.imgbb.com                             │
// │  4. Click "Get API key" → Copy the key                       │
// │  5. Paste it in IMGBB_API_KEY below                          │
// ├─────────────────────────────────────────────────────────────┤
// │  STEP 2: GET FREE CLOUD DATABASE (JSONbin)                   │
// │  1. Open: https://jsonbin.io                                 │
// │  2. Sign up FREE (use narenkarthic34@gmail.com)              │
// │  3. Click "Create Bin" → paste {} → click Create            │
// │  4. Copy the BIN ID from the URL                             │
// │  5. Go to Account → API Keys → Copy your Master key         │
// │  6. Paste them below                                          │
// └─────────────────────────────────────────────────────────────┘
//
// AFTER setting both keys → images upload on one device & show
// automatically on ALL other devices (phone, laptop, tablet)!
// ══════════════════════════════════════════════════════════════════

// ── STEP 1: ImgBB (Free Image Hosting) ──
// Get FREE key at: https://api.imgbb.com
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY_HERE';

// ── STEP 2: JSONbin (Free Cloud Sync Database) ──
// Get FREE at: https://jsonbin.io → Create Bin → Copy ID & Key
const JSONBIN_BIN_ID = 'YOUR_JSONBIN_BIN_ID_HERE';   // e.g. '6612a3abc123456789abcdef'
const JSONBIN_API_KEY = 'YOUR_JSONBIN_MASTER_KEY';     // e.g. '$2b$10$...'

// ── (Optional) Firebase — for advanced users only ──
// Skip this if you're using ImgBB + JSONbin above
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
