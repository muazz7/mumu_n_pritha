/* ─── HomePlate app.js ─── */
'use strict';

/* ══════════ NAVBAR SCROLL EFFECT ══════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* ══════════ HAMBURGER MENU ══════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  })
);

/* ══════════ ANIMATED COUNTER ══════════ */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

/* ══════════ INTERSECTION OBSERVER ══════════ */
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

// Stats counter
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10));
      });
      statsObserver.disconnect();
    }
  });
}, observerOptions);
const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// Reveal elements
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════ DISHES DATA ══════════ */
const dishes = [
  { name: 'Butter Chicken', cook: "Meena's Kitchen", price: '৳1200', rating: '4.9', emoji: '🍛', type: 'non-veg' },
  { name: 'Palak Paneer',   cook: "Meena's Kitchen", price: '৳1000', rating: '4.8', emoji: '🥘', type: 'veg' },
  { name: 'Tacos de Carnitas', cook: 'Carlos & Maria', price: '৳1100', rating: '5.0', emoji: '🌮', type: 'non-veg' },
  { name: 'Vegan Buddha Bowl', cook: 'Green Roots Co.', price: '৳900',  rating: '4.7', emoji: '🥗', type: 'vegan' },
  { name: 'Beef Biryani',   cook: "Aisha's Table", price: '৳1400', rating: '4.9', emoji: '🍚', type: 'non-veg' },
  { name: 'Lemon Tart',     cook: 'Sweet Corner',    price: '৳700',  rating: '4.8', emoji: '🍮', type: 'dessert' },
  { name: 'Shakshuka',      cook: "Aisha's Table",   price: '৳1000', rating: '4.7', emoji: '🍳', type: 'veg' },
  { name: 'Chocolate Lava', cook: 'Sweet Corner',    price: '৳800',  rating: '5.0', emoji: '🍫', type: 'dessert' },
  { name: 'Pad Thai',       cook: "Suki's Wok",      price: '৳1100', rating: '4.8', emoji: '🍜', type: 'non-veg' },
  { name: 'Falafel Bowl',   cook: 'Zara\'s Mezze',   price: '৳900',  rating: '4.6', emoji: '🧆', type: 'vegan' },
  { name: 'Dal Makhani',    cook: "Meena's Kitchen",  price: '৳900',  rating: '4.9', emoji: '🫕', type: 'veg' },
  { name: 'Tres Leches',    cook: 'Carlos & Maria',  price: '৳700',  rating: '4.9', emoji: '🍰', type: 'dessert' },
];

const typeLabelMap = { veg: '🌿 Veg', 'non-veg': '🍗 Non-Veg', vegan: '🥦 Vegan', dessert: '🍮 Dessert' };

function renderDishes(filter = 'all') {
  const grid = document.getElementById('dishes-grid');
  const filtered = filter === 'all' ? dishes : dishes.filter(d => d.type === filter);
  grid.innerHTML = '';
  filtered.forEach((dish, i) => {
    const card = document.createElement('div');
    card.className = 'dish-card reveal';
    card.style.transitionDelay = `${i * 50}ms`;
    card.innerHTML = `
      <div class="dish-img-wrap">
        <div class="dish-emoji">${dish.emoji}</div>
        <span class="dish-badge ${dish.type}">${typeLabelMap[dish.type]}</span>
      </div>
      <div class="dish-info">
        <div class="dish-name">${dish.name}</div>
        <div class="dish-cook">by ${dish.cook}</div>
        <div class="dish-footer">
          <span class="dish-price">${dish.price}</span>
          <span class="dish-rating"><span>★</span> ${dish.rating}</span>
        </div>
      </div>`;
    grid.appendChild(card);
    // re-observe for animation
    setTimeout(() => revealObserver.observe(card), 10);
  });
}

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderDishes(tab.dataset.filter);
  });
});

renderDishes();

/* ══════════ TESTIMONIALS CAROUSEL ══════════ */
const track    = document.getElementById('testimonials-track');
const dotsWrap = document.getElementById('carousel-dots');
const cards    = track.querySelectorAll('.testimonial-card');
let current    = 0;
let autoTimer;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(idx) {
  current = (idx + cards.length) % cards.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === current)
  );
}

document.getElementById('carousel-prev').addEventListener('click', () => {
  goTo(current - 1);
  resetAuto();
});
document.getElementById('carousel-next').addEventListener('click', () => {
  goTo(current + 1);
  resetAuto();
});

function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
function resetAuto()  { clearInterval(autoTimer); startAuto(); }
startAuto();

/* ══════════ COPY IMAGES TO PROJECT ROOT ══════════ */
// Images were generated in a temp dir; we'll attempt to use them by relative path.
// A fallback gradient is applied via CSS if they fail to load.
const heroImg = document.getElementById('hero-main-img');
if (heroImg) {
  heroImg.onerror = () => {
    heroImg.style.display = 'none';
    heroImg.parentElement.style.background = 'linear-gradient(135deg, #BAE6FD 0%, #A7F3D0 50%, #FCD34D 100%)';
    heroImg.parentElement.style.minHeight = '440px';
    heroImg.parentElement.style.display = 'flex';
    heroImg.parentElement.style.alignItems = 'center';
    heroImg.parentElement.style.justifyContent = 'center';
    const fallback = document.createElement('div');
    fallback.style.cssText = 'font-size:5rem; opacity:.6;';
    fallback.textContent = '🍱';
    heroImg.parentElement.appendChild(fallback);
  };
}

/* ══════════ HOW IT WORKS MODAL INTERACTIVITY ══════════ */
const howItWorksModal = document.getElementById('how-it-works-modal');
const howItWorksClose = document.getElementById('how-it-works-close-btn');

function openHowItWorksModal(e) {
  if (e) e.preventDefault();
  howItWorksModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeHowItWorksModal() {
  howItWorksModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (howItWorksClose) {
  howItWorksClose.addEventListener('click', closeHowItWorksModal);
}
if (howItWorksModal) {
  howItWorksModal.addEventListener('click', (e) => {
    if (e.target === howItWorksModal) closeHowItWorksModal();
  });
}

/* ══════════ SMOOTH ANCHOR SCROLL ══════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#how-it-works') {
      e.preventDefault();
      openHowItWorksModal();
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══════════ PARALLAX ON HERO BLOBS ══════════ */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const blobs = document.querySelectorAll('.blob');
  blobs[0] && (blobs[0].style.transform = `translate(${sy * .04}px, ${-sy * .06}px)`);
  blobs[1] && (blobs[1].style.transform = `translate(${-sy * .03}px, ${sy * .04}px)`);
}, { passive: true });

/* ══════════ ACTIVE NAV LINK ON SCROLL ══════════ */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active-link', scrollPos >= top && scrollPos < bottom);
  });
}, { passive: true });

/* ══════════ COMING SOON POPUP INTERACTIVITY ══════════ */
const modal = document.getElementById('coming-soon-modal');
const modalClose = document.getElementById('modal-close-btn');
const emailInput = document.getElementById('modal-email-input');
const submitBtn = document.getElementById('modal-submit-btn');
const feedbackMsg = document.getElementById('modal-feedback-msg');

function openModal(e) {
  if (e) e.preventDefault();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  feedbackMsg.textContent = '';
  emailInput.value = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Event delegation to catch clicks on any link or button
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('a, button, .dish-card');
  if (!trigger) return;

  // Ignore clicks inside modal overlays
  if (trigger.closest('.modal-overlay')) {
    return;
  }

  // Ignore navigation section scrolls (links starting with # followed by letters)
  if (trigger.tagName === 'A') {
    const href = trigger.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      return; 
    }
  }

  // Ignore internal interaction elements
  if (
    trigger.id === 'hamburger' ||
    trigger.closest('.hamburger') ||
    trigger.classList.contains('carousel-btn') ||
    trigger.classList.contains('filter-tab') ||
    trigger.id === 'modal-close-btn' ||
    trigger.id === 'modal-submit-btn' ||
    trigger.classList.contains('modal-close')
  ) {
    return;
  }

  openModal(e);
});

// Email notification submission
submitBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedbackMsg.textContent = 'Please enter a valid email address.';
    feedbackMsg.className = 'modal-feedback error';
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  setTimeout(() => {
    feedbackMsg.textContent = 'Thank you! We will notify you when we launch.';
    feedbackMsg.className = 'modal-feedback success';
    submitBtn.textContent = 'Notify Me';
    submitBtn.disabled = false;
    emailInput.value = '';
    
    setTimeout(closeModal, 2000);
  }, 1000);
});

