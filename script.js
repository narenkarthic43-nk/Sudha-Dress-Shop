// ============================
// MAIN SCRIPT — Sudha Dress Shop
// ============================

// ── Navbar ──
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', y > 60);
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 400);
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');


    const s = hamburger.querySelectorAll('span');
    const open = navLinks.classList.contains('open');
    s[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    s[1].style.opacity = open ? '0' : '1';
    s[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

// ── Scroll Reveal ──
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

// ── Stat Counters ──
const statNums = document.querySelectorAll('.stat-num');
let counted = false;
function runCounters() {
  statNums.forEach(el => {
    const raw = el.textContent;
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[\d.]/g, '');
    if (!num) return;
    let cur = 0;
    const step = num / 80;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      el.textContent = (Number.isInteger(num) ? Math.floor(cur) : cur.toFixed(0)) + suffix;
      if (cur >= num) clearInterval(t);
    }, 16);
  });
}
const heroEl = document.querySelector('.hero');
if (heroEl) {
  new IntersectionObserver((e) => {
    if (e[0].isIntersecting && !counted) { counted = true; runCounters(); }
  }, { threshold: 0.3 }).observe(heroEl);
}

// ── Active Nav Link ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 120;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => { a.style.color = ''; a.style.background = ''; });
      const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (active) { active.style.color = 'var(--gold)'; active.style.background = 'rgba(201,168,76,0.1)'; }
    }
  });
});

// ── Contact Form ──
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-form');
  const success = document.getElementById('form-success');
  if (!btn) return;

  // ── Collect form data ──
  const name = (document.getElementById('cname')?.value || '').trim();
  const phone = (document.getElementById('cphone')?.value || '').trim();
  const service = document.getElementById('cservice')?.value || '';
  const message = (document.getElementById('cmessage')?.value || '').trim();

  // Build a nice WhatsApp message
  let waMsg = `👗 *Sudha Dress Shop Enquiry*\n\n`;
  waMsg += `*Name:* ${name}\n`;
  waMsg += `*Phone:* ${phone}\n`;
  if (service) waMsg += `*Enquiry For:* ${service}\n`;
  if (message) waMsg += `*Message:* ${message}\n`;
  waMsg += `\n_Sent from sudhashop.com_`;

  const waUrl = `https://wa.me/919442261828?text=${encodeURIComponent(waMsg)}`;

  btn.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp...';
  btn.disabled = true;

  if (success) {
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 6000);
  }

  // Open WhatsApp after brief delay (so user sees the confirmation)
  setTimeout(() => {
    window.open(waUrl, '_blank');
    e.target.reset();
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
    btn.disabled = false;
  }, 800);
}


// ── Scroll Top ──
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ── Card Tilt ──
document.querySelectorAll('.tailor-card, .offer-card, .collection-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ============================
// DYNAMIC CONTENT LOADER
// Loads admin-saved content from localStorage / Firebase
// ============================

const DATA_KEY = 'sudha_site_data';
function getSiteData() { return JSON.parse(localStorage.getItem(DATA_KEY) || '{}'); }

function applyDynamicContent(data) {
  if (!data) return;

  // ── Offers ──
  const offers = data.offers;
  if (offers) {
    [1, 2, 3, 4].forEach(n => {
      const o = offers[`offer${n}`];
      if (!o) return;
      const t = document.getElementById(`dyn-offer${n}-title`);
      const d = document.getElementById(`dyn-offer${n}-desc`);
      const b = document.getElementById(`dyn-offer${n}-badge`);
      if (t) t.textContent = o.title;
      if (d) d.textContent = o.desc;
      if (b) b.textContent = o.badge;
    });
  }

  // ── Collections Text (Step 4 — owner editable) ──
  const collections = data.collections;
  if (collections) {
    ['sarees', 'lehengas', 'suits', 'kurtis', 'kids', 'mens'].forEach(k => {
      const c = collections[k];
      if (!c) return;
      const card = document.getElementById(`col-${k}`);
      if (!card) return;
      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p');
      const priceEl = card.querySelector('.collection-price');
      if (titleEl && c.title) titleEl.textContent = c.title;
      if (descEl && c.desc) descEl.textContent = c.desc;
      if (priceEl && c.price) priceEl.innerHTML = c.price;
    });
  }

  // ── Tailoring Services (Step 6 — owner editable) ──
  const services = data.services;
  if (Array.isArray(services)) {
    services.forEach((s, i) => {
      const n = i + 1;
      const titleEl = document.getElementById(`dyn-svc${n}-title`);
      const descEl = document.getElementById(`dyn-svc${n}-desc`);
      if (titleEl && s.title) titleEl.textContent = s.title;
      if (descEl && s.desc) descEl.textContent = s.desc;
    });
  }

  // ── Pricing Table (Step 2 — owner editable) ──
  const pricing = data.pricing;
  if (Array.isArray(pricing)) {
    pricing.forEach((p, i) => {
      const n = i + 1;
      const svcEl = document.getElementById(`dyn-price${n}-service`);
      const prEl = document.getElementById(`dyn-price${n}-price`);
      const delEl = document.getElementById(`dyn-price${n}-delivery`);
      if (svcEl && p.service) svcEl.textContent = p.service;
      if (prEl && p.price) prEl.textContent = p.price;
      if (delEl && p.delivery) delEl.textContent = p.delivery;
    });
  }

  // ── Announcement ──
  const content = data.content;
  if (content) {
    const ann = document.querySelector('.announcement-bar span');
    if (ann && content.announcement) ann.textContent = content.announcement;

    const heroSub = document.querySelector('.hero-sub-title');
    if (heroSub && content.heroSub) heroSub.textContent = content.heroSub;

    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc && content.heroDesc) heroDesc.textContent = content.heroDesc;

    // Ticker
    if (content.ticker && Array.isArray(content.ticker)) {
      const scroller = document.querySelector('.advert-scroll');
      if (scroller) {
        const items = [...content.ticker, ...content.ticker]; // duplicate for seamless scroll
        scroller.innerHTML = items.map(t => `<span>${t}</span>`).join('');
      }
    }
  }
} // end applyDynamicContent


// ── Load images from JSONBlob (Auto Sync) or IndexedDB ──
window.SUDHA_CACHED_IMAGES = null;

function loadImagesFromJSONBlobOrIDB() {
  const imgCatMap = {
    sarees: 'img-sarees', lehengas: 'img-lehengas', suits: 'img-suits',
    kurtis: 'img-kurtis', kids: 'img-kids', mens: 'img-mens'
  };

  const displayImages = (imagesArray) => {
    const byCategory = {};
    imagesArray.forEach(r => {
      if (!byCategory[r.category]) byCategory[r.category] = [];
      byCategory[r.category].push(r);
    });
    Object.entries(byCategory).forEach(([cat, imgs]) => {
      if (!imgs.length) return;
      const sorted = imgs.sort((a, b) => a.ts - b.ts); // ts=0 means 'main' starred image
      const main = sorted[0];
      const elId = imgCatMap[cat];
      if (elId) {
        const el = document.getElementById(elId);
        if (el && main.url) el.src = main.url;
      }
    });
  };

  // Local IDB Fallback Function
  const loadFromIDB = () => {
    try {
      const req = indexedDB.open('sudha_images_v3', 2);
      req.onsuccess = e => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains('images')) return;
        const tx = idb.transaction('images', 'readonly');
        tx.objectStore('images').getAll().onsuccess = (ev) => {
          if (ev.target.result) displayImages(ev.target.result);
        };
      };
    } catch (e) { console.error('IDB load failed', e); }
  };

  // 1. Fetch from JSONBlob (Global Sync Source) with cache busting for mobile devices
  if (typeof JSONBLOB_ID !== 'undefined' && JSONBLOB_ID) {
    fetch(`https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data && data.images) {
          window.SUDHA_CACHED_IMAGES = data.images;
          let remoteImages = [];
          Object.keys(data.images).forEach(cat => {
            data.images[cat].forEach(img => remoteImages.push({ category: cat, ...img }));
          });

          if (remoteImages.length > 0) {
            displayImages(remoteImages);
          } else {
            loadFromIDB();
          }
        } else {
          loadFromIDB();
        }
      }).catch(e => {
        console.log('Image sync blocked or failed, loading local:', e);
        loadFromIDB();
      });
  } else {
    loadFromIDB();
  }
}
// ── Load from localStorage on start ──
window.addEventListener('DOMContentLoaded', () => {
  applyDynamicContent(getSiteData());
  loadImagesFromJSONBlobOrIDB();

  // ── Show user in navbar ──
  const currentUser = JSON.parse(sessionStorage.getItem('sudha_current_user') || 'null');
  const isAdmin = sessionStorage.getItem('sudha_is_admin') === 'true';

  // Admin bar
  if (isAdmin) {
    const adminBar = document.getElementById('admin-bar');
    if (adminBar) adminBar.style.display = 'block';
  }

  // User greeting in navbar
  if (currentUser) {
    const navBtn = document.getElementById('btn-login-nav');
    const navInfo = document.getElementById('nav-user-info');
    if (navBtn) {
      if (isAdmin) {
        navBtn.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser.name || 'Account'}`;
        navBtn.href = 'admin.html';
      } else {
        navBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
        navBtn.href = "#";
        navBtn.onclick = function (e) {
          e.preventDefault();
          sessionStorage.removeItem('sudha_current_user');
          location.reload();
        };
      }
    }
    if (navInfo) {
      navInfo.textContent = isAdmin ? '👑 Admin' : `Hi, ${(currentUser.name || '').split(' ')[0]}`;
      navInfo.style.display = 'inline';
    }
  }

  // ── JSONBlob auto-sync ──
  if (typeof JSONBLOB_ID !== 'undefined' && JSONBLOB_ID) {
    fetch(`https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(remoteData => {
        if (remoteData) {
          // Merge and apply text data
          const { images, ...textData } = remoteData;
          if (Object.keys(textData).length > 0) {
            const merged = { ...getSiteData(), ...textData };
            localStorage.setItem(DATA_KEY, JSON.stringify(merged));
            applyDynamicContent(merged);
          }
        }
      }).catch(e => console.warn('JSONBlob Sync error:', e));
  }
});

// ============================
// GALLERY AND ORDER FUNCTIONS
// ============================

function openGallery(catKey, catName) {
  const modal = document.getElementById('gallery-modal');
  const title = document.getElementById('gallery-title');
  const grid = document.getElementById('gallery-grid');

  if (!modal || !grid) return;

  title.textContent = catName;
  grid.innerHTML = '<p style="text-align:center;width:100%;color:var(--gold);">Loading images...</p>';
  modal.style.display = 'flex';

  const renderImages = (imgs) => {
    if (!imgs || imgs.length === 0) {
      grid.innerHTML = '<p style="text-align:center;width:100%;color:var(--text-muted);">No items currently available in this collection.</p>';
      return;
    }

    const sorted = imgs.sort((a, b) => a.ts - b.ts);
    grid.innerHTML = sorted.map(img => {
      // Create preview link url
      const baseUrl = window.location.href.split('/').slice(0, -1).join('/');
      const previewUrl = `${baseUrl}/preview.html?cat=${encodeURIComponent(catName)}&id=${img.ts}`;

      return `
        <div class="gallery-item">
          <img src="${img.url}" alt="${img.name || catName}" loading="lazy" />
          <div class="gallery-item-info">
             <p>${img.name || catName}</p>
             <button onclick="placeOrderSpecific('${catName}', '${previewUrl}', '${img.url}', '${(img.name || catName).replace(/'/g, "\\\\'")}')" class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem; width: 100%; justify-content: center;">
               <i class="fab fa-whatsapp"></i> Order This
             </button>
          </div>
        </div>
      `;
    }).join('');
  };

  if (window.SUDHA_CACHED_IMAGES && window.SUDHA_CACHED_IMAGES[catKey]) {
    renderImages(window.SUDHA_CACHED_IMAGES[catKey]);
    return;
  }

  // Fallback to IndexedDB
  const IDB_NAME = 'sudha_images_v3';
  const IDB_STORE = 'images';
  try {
    const req = indexedDB.open(IDB_NAME, 2);
    req.onsuccess = e => {
      const idb = e.target.result;
      if (!idb.objectStoreNames.contains(IDB_STORE)) {
        renderImages([]);
        return;
      }
      const tx = idb.transaction(IDB_STORE, 'readonly');
      tx.objectStore(IDB_STORE).index('category').getAll(catKey).onsuccess = (ev) => {
        renderImages(ev.target.result || []);
      };
    };
    req.onerror = () => renderImages([]);
  } catch (e) {
    renderImages([]);
  }
}

function closeGallery() {
  const modal = document.getElementById('gallery-modal');
  if (modal) modal.style.display = 'none';
}

let pendingOrderDetails = null;

function placeOrderSpecific(category, previewUrl, rawImgUrl, itemName) {
  pendingOrderDetails = { category, previewUrl, rawImgUrl, itemName };
  
  const currentUser = JSON.parse(sessionStorage.getItem('sudha_current_user') || 'null');
  if (currentUser) {
    document.getElementById('order-name').value = currentUser.name || '';
    document.getElementById('order-phone').value = currentUser.phone || '';
  }
  
  const modal = document.getElementById('order-modal');
  if (modal) modal.style.display = 'flex';
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (modal) modal.style.display = 'none';
}

async function submitOrder() {
  const name = document.getElementById('order-name').value.trim();
  const phone = document.getElementById('order-phone').value.trim();

  if (!name || !phone) {
    alert("Please enter both your name and WhatsApp number.");
    return;
  }

  const { category, previewUrl, rawImgUrl, itemName } = pendingOrderDetails;
  
  const order = {
    id: Date.now().toString(),
    customerName: name,
    customerPhone: phone,
    itemName: itemName || category,
    imgUrl: rawImgUrl || previewUrl,
    date: new Date().toISOString()
  };

  const btn = document.querySelector('#order-modal .btn-primary');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  btn.disabled = true;

  try {
    // Save to Cloud (JSONBlob)
    if (typeof JSONBLOB_ID !== 'undefined' && JSONBLOB_ID) {
      const res = await fetch(`https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}`);
      const data = await res.json();
      if (!data.orders) data.orders = [];
      data.orders.push(order);
      
      await fetch(`https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    // Open WhatsApp
    const waPhone = '919442261828';
    const waMsg = `👗 *SUDHA DRESS SHOP ORDER*\n\n*Customer:* ${name}\n*Item:* ${itemName || category}\n*Link:* ${rawImgUrl || previewUrl}\n\nI want to confirm this order.`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`, '_blank');

    closeOrderModal();
    closeGallery();
    alert("Thank you! Your order request is sent. Admin will confirm shortly.");
  } catch (e) {
    console.error(e);
    alert("Error placing order. Please try again.");
  } finally {
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> OK — CONFIRM ORDER';
    btn.disabled = false;
  }
}

// Close modals on click outside
window.onclick = function (event) {
  const galleryModal = document.getElementById('gallery-modal');
  const orderModal = document.getElementById('order-modal');
  if (event.target == galleryModal) galleryModal.style.display = "none";
  if (event.target == orderModal) orderModal.style.display = "none";
}

