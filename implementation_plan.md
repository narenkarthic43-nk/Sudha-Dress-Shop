# Implementation Plan — Image Upload Sync & Vercel Support

When deploying to Vercel or any static live website host, the environment is serverless and the filesystem is read-only. This means the app cannot save uploaded files directly into the local `uploads/` folder on the live website.

To make deploying to Vercel and local usage simple and robust, we will introduce an explicit `UPLOAD_MODE` setting in the configuration layer. This lets the admin decide how images are processed and stored.

## User Review Required

> [!IMPORTANT]
> We will add an `UPLOAD_MODE` config to `firebase-config.js` with three options:
> - `'local'`: Saves to the local `uploads/` folder on disk (requires running `node server.js` locally).
> - `'cloud'`: Saves to cloud image hosting (ImgBB/FreeImage.host) directly. **Ideal for Vercel/live hosting.**
> - `'browser'`: Saves directly to browser storage (**IndexedDB**) and syncs as a compressed **Base64 Data URL** to the cloud database (JSONBlob). **Runs 100% in the browser, no server or cloud hosting accounts needed.**
> - `'auto'`: Attempts local upload first, then falls back to cloud, and finally falls back to browser base64.

## Proposed Changes

### Configuration Layer

#### [MODIFY] [firebase-config.js](file:///c:/Users/naren/OneDrive/ANTIGRAVITY/dress-tailoring/firebase-config.js)

Add the `UPLOAD_MODE` constant at the end of the config:
```javascript
// ── STEP 6: Image Upload Mode ──
// Options: 
//   - 'browser' : Saves in browser (IndexedDB) and syncs as base64. No server/cloud account needed.
//   - 'cloud'   : Uploads directly to Cloud (ImgBB / FreeImage.host). Required for Vercel/live hosting.
//   - 'local'   : Saves images to local uploads/ folder. Requires 'node server.js' to be running.
//   - 'auto'    : Attempts local server upload first, falls back to cloud/browser.
const UPLOAD_MODE = 'browser'; 
```

### Admin Panel Logic

#### [MODIFY] [admin.js](file:///c:/Users/naren/OneDrive/ANTIGRAVITY/dress-tailoring/admin.js)

Update the upload sequence in `processUpload` to honor `UPLOAD_MODE`:
- If `UPLOAD_MODE` is `'browser'`, compress the image to base64 immediately and bypass local/cloud server uploads.
- If `UPLOAD_MODE` is `'cloud'`, bypass the local server upload entirely to prevent slow/failed requests on Vercel.
- If `UPLOAD_MODE` is `'local'`, only attempt local upload (do not fall back to cloud).
- If `UPLOAD_MODE` is `'auto'`, keep the current auto-detect behavior.

---

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
1. Set `UPLOAD_MODE = 'browser'` in `firebase-config.js`.
2. Open `admin.html` and upload an image.
3. Verify it is compressed locally and saved to IndexedDB & synced to JSONBlob as base64 without needing any server running.
4. Set `UPLOAD_MODE = 'local'`, run `node server.js` and verify it saves to the `uploads/` folder.
