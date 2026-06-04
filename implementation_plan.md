# Implementation Plan — Fix 'Failed to fetch' DNS/CORS ISP Block for JSONBlob

The user's screenshot shows the error `"Failed to fetch"`. This occurs because certain internet service providers (such as Jio in India) implement DNS-level blocks on free JSON hosting platforms like `jsonblob.com`. When the browser attempts to fetch the orders, the network request is blocked, throwing a TypeError.

To solve this transparently across all files (Admin Panel, Customer Portal, and Login System), we will implement an **automatic, self-healing CORS/ISP proxy fallback** in [firebase-config.js](file:///c:/Users/naren/OneDrive/ANTIGRAVITY/dress-tailoring/firebase-config.js).

## User Review Required

> [!IMPORTANT]
> - We will monkey-patch the global `window.fetch` in `firebase-config.js`.
> - If a request to `jsonblob.com` fails with a network/DNS error (`Failed to fetch`), the system will **automatically retry the request** via `corsproxy.io` (a free CORS proxy).
> - This requires **zero configuration changes** by the user and instantly bypasses ISP DNS blocks on all devices.

## Proposed Changes

### Configuration Layer

#### [MODIFY] [firebase-config.js](file:///c:/Users/naren/OneDrive/ANTIGRAVITY/dress-tailoring/firebase-config.js)

Inject the custom `fetch` proxy wrapper right after the `JSONBLOB_ID` definition:
- Detect any requests containing `jsonblob.com/api/jsonBlob`.
- Try original direct fetch first.
- If it throws a network/TypeError (`Failed to fetch`), intercept and retry via `https://corsproxy.io/?url=` + encoded target URL.

---

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- Load the Admin Panel to verify that `loadOrders` resolves and displays pending orders successfully even on networks where `jsonblob.com` is blocked.
