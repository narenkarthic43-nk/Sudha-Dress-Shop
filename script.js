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
    kurtis: 'img-kurtis', kids: 'img-kids', mens: 'img-mens', hero: 'hero-bg-img'
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

  // 1. Fetch from JSONBlob (Global Sync Source)
  if (typeof JSONBLOB_ID !== 'undefined' && JSONBLOB_ID) {
    fetch(`https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.images) {
          window.SUDHA_CACHED_IMAGES = data.images;
          let remoteImages = [];
          Object.keys(data.images).forEach(cat => {
            data.images[cat].forEach(img => remoteImages.push({ category: cat, ...img }));
          });
          displayImages(remoteImages);
        }
      }).catch(e => console.log('Image sync blocked or failed:', e));
  } else {
    // 2. Fallback to Local IndexedDB
    const IDB_NAME = 'sudha_images_v3';
    const IDB_STORE = 'images';
    try {
      const req = indexedDB.open(IDB_NAME, 2);
      req.onsuccess = e => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains(IDB_STORE)) return;
        const tx = idb.transaction(IDB_STORE, 'readonly');
        tx.objectStore(IDB_STORE).getAll().onsuccess = (ev) => {
          if (ev.target.result) displayImages(ev.target.result);
        };
      };
    } catch (e) { }
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
      navBtn.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser.name || 'Account'}`;
      navBtn.href = isAdmin ? 'admin.html' : '#';
    }
    if (navInfo) {
      navInfo.textContent = isAdmin ? '👑 Admin' : `Hi, ${(currentUser.name || '').split(' ')[0]}`;
      navInfo.style.display = 'inline';
    }
  }

  // ── JSONBlob auto-sync ──
  if (typeof JSONBLOB_ID !== 'undefined' && JSONBLOB_ID) {
    fetch(`https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}`)
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

// ── Admin logout from front page ──
function adminLogoutFront() {
  sessionStorage.removeItem('sudha_is_admin');
  sessionStorage.removeItem('sudha_current_user');
  location.reload();
}

// ============================
// COLLECTION GALLERY MODAL
// Opens a lightbox with all uploaded images for a category
// ============================
function openCollectionGallery(category, label) {
  const modal = document.getElementById('collection-modal');
  const title = document.getElementById('modal-cat-title');
  const grid = document.getElementById('modal-gallery-grid');
  if (!modal || !grid) return;

  // Show modal
  title.textContent = label || category;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scroll

  const displayGallery = (imgs) => {
    if (!imgs || imgs.length === 0) {
      showEmptyGallery(grid, label);
      return;
    }
    imgs.sort((a, b) => a.ts - b.ts);
    grid.innerHTML = imgs.map((img, i) => `
        <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(201,168,76,${i === 0 ? '0.5' : '0.1'});background:#1a1209;position:relative;transition:transform 0.2s,border-color 0.2s;cursor:pointer;" onmouseover="this.style.transform='scale(1.03)';this.style.borderColor='rgba(201,168,76,0.5)'" onmouseout="this.style.transform='scale(1)';this.style.borderColor='rgba(201,168,76,${i === 0 ? '0.5' : '0.1'})'">
          ${i === 0 ? '<div style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#c9a84c,#e0c26a);color:#1a0f00;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:3px 8px;border-radius:20px;z-index:1;">⭐ Main</div>' : ''}
          <img src="${img.url}" alt="${img.name || label}" style="width:100%;height:200px;object-fit:cover;display:block;" onerror="this.style.display='none'" />
          <div style="padding:10px 12px;"><p style="color:rgba(255,255,255,0.5);font-size:0.75rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${img.name || 'Photo ' + (i + 1)}</p></div>
        </div>
      `).join('');
  };

  if (window.SUDHA_CACHED_IMAGES && window.SUDHA_CACHED_IMAGES[category]) {
    displayGallery(window.SUDHA_CACHED_IMAGES[category]);
  } else {
    // Local IndexedDB check as fallback
    try {
      const req = indexedDB.open('sudha_images_v3', 2);
      req.onsuccess = e => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains('images')) return showEmptyGallery(grid, label);
        idb.transaction('images', 'readonly').objectStore('images').index('category').getAll(category).onsuccess = (ev) => {
          displayGallery(ev.target.result || []);
        };
      };
      req.onerror = () => showEmptyGallery(grid, label);
    } catch (e) { showEmptyGallery(grid, label); }
  }
}

function showEmptyGallery(grid, label) {
  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
      <i class="fas fa-images" style="font-size:4rem;color:rgba(201,168,76,0.2);display:block;margin-bottom:20px;"></i>
      <h3 style="color:rgba(255,255,255,0.6);font-family:'Playfair Display',serif;margin-bottom:8px;">No Photos Yet</h3>
      <p style="color:rgba(255,255,255,0.35);font-size:0.9rem;">The shop owner hasn't uploaded photos for ${label} yet.</p>
      <p style="color:rgba(255,255,255,0.35);font-size:0.85rem;margin-top:8px;">Check back soon or WhatsApp us to ask!</p>
    </div>`;
}

function closeCollectionGallery() {
  const modal = document.getElementById('collection-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = ''; // Restore scroll
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('collection-modal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeCollectionGallery();
    });
  }
  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCollectionGallery();
  });
});

