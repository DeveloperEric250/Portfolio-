/* =============================================
   PORTFOLIO – script.js
   Nsabimana Eric | University of Rwanda
   ============================================= */

/* ── CURSOR GLOW ─────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* ── NAVBAR SCROLL + ACTIVE LINK ─────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Scroll-spy active link
  let current = '';
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ── MOBILE MENU TOGGLE ──────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

// Close on nav link click
navLinksEl.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ── INTERSECTION OBSERVER (fade-in) ─────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(
  '.project-card, .skill-category, .stat-card, .contact-item, .contact-form, .cert-card'
).forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// When "visible" is added via observer
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule('.visible { opacity: 1 !important; transform: none !important; }', styleSheet.cssRules.length);
} catch (e) { /* cross-origin safety */ }

/* ── SKILL BARS ──────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill) => {
          fill.style.width = fill.dataset.width + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.skill-category').forEach((el) => skillObserver.observe(el));

/* ── STAT COUNTERS ───────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.count === '100' ? '%' : '+');
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
const statsGrid = document.getElementById('statsGrid');
if (statsGrid) counterObserver.observe(statsGrid);

/* ── TESTIMONIALS SLIDER ─────────────────────── */
const cards    = document.querySelectorAll('.testimonial-card');
const dots     = document.querySelectorAll('.dot');
const prevBtn  = document.getElementById('testiPrev');
const nextBtn  = document.getElementById('testiNext');
let   current  = 0;
let   autoPlay;

function showSlide(index) {
  cards.forEach((c) => c.classList.remove('active'));
  dots.forEach((d)  => d.classList.remove('active'));
  current = (index + cards.length) % cards.length;
  cards[current].classList.add('active');
  dots[current].classList.add('active');
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => { showSlide(current - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { showSlide(current + 1); resetAutoPlay(); });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => { showSlide(parseInt(dot.dataset.index, 10)); resetAutoPlay(); });
  });

  function startAutoPlay() { autoPlay = setInterval(() => showSlide(current + 1), 4500); }
  function resetAutoPlay () { clearInterval(autoPlay); startAutoPlay(); }

  // Make sure all cards are visible (they toggle via display:none/flex not opacity)
  cards.forEach((c) => {
    c.style.opacity = '';
    c.style.transform = '';
  });

  // Show first slide immediately
  showSlide(0);
  startAutoPlay();
}

/* ── CONTACT FORM ────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span>';

    // Simulate async send (replace with real endpoint if needed)
    setTimeout(() => {
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      if (formSuccess) {
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }
    }, 1200);
  });
}

/* ── SMOOTH SCROLL (fallback) ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── CERTIFICATE UPLOAD SYSTEM ───────────────── */
const certModalOverlay = document.getElementById('certModalOverlay');
const openCertModalBtn = document.getElementById('openCertModal');
const closeCertModalBtn = document.getElementById('closeCertModal');
const cancelCertModalBtn = document.getElementById('cancelCertModal');
const certUploadForm = document.getElementById('certUploadForm');
const certFileInput = document.getElementById('certFile');
const certFileLabel = document.getElementById('certFileLabel');
const certsGrid = document.getElementById('certsGrid');

let certFileDataURL = null;
let certFileName = '';

// Open modal
if (openCertModalBtn) {
  openCertModalBtn.addEventListener('click', () => {
    certModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

// Close modal helpers
function closeModal() {
  certModalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  certUploadForm.reset();
  certFileDataURL = null;
  certFileName = '';
  certFileLabel.textContent = 'Click to choose file from your device';
}

if (closeCertModalBtn)  closeCertModalBtn.addEventListener('click', closeModal);
if (cancelCertModalBtn) cancelCertModalBtn.addEventListener('click', closeModal);
certModalOverlay.addEventListener('click', (e) => { if (e.target === certModalOverlay) closeModal(); });

// File chosen — read it into memory
if (certFileInput) {
  certFileInput.addEventListener('change', () => {
    const file = certFileInput.files[0];
    if (!file) return;
    certFileName = file.name;
    certFileLabel.textContent = '✓ ' + file.name;
    const reader = new FileReader();
    reader.onload = (e) => { certFileDataURL = e.target.result; };
    reader.readAsDataURL(file);
  });
}

// Build a certificate card HTML
function buildCertCard(cert, index) {
  const badgeClass = cert.status === 'completed' ? 'cert-badge-green' : 'cert-badge-blue';
  const badgeText  = cert.status === 'completed' ? 'Completed' : 'In Progress';
  const viewBtn = cert.fileData
    ? `<a href="${cert.fileData}" download="${cert.fileName}" target="_blank" class="cert-view-btn">
         <i class="fas fa-eye"></i> View Certificate
       </a>`
    : '';
  return `
    <div class="cert-card user-cert" id="user-cert-${index}">
      <div class="cert-icon"><i class="fas fa-certificate"></i></div>
      <div class="cert-body">
        <span class="cert-issuer">${cert.issuer}</span>
        <h3 class="cert-title">${cert.title}</h3>
        ${cert.desc ? `<p class="cert-desc">${cert.desc}</p>` : ''}
        <div class="cert-meta">
          <span class="cert-date"><i class="fas fa-calendar-alt"></i> ${cert.year || 'N/A'}</span>
          <span class="cert-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:4px; align-items:center;">
          ${viewBtn}
          <button class="cert-delete-btn" onclick="deleteUserCert(${index})">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    </div>`;
}

// Render all saved certs from localStorage
function renderSavedCerts() {
  const saved = JSON.parse(localStorage.getItem('userCerts') || '[]');
  saved.forEach((cert, i) => {
    certsGrid.insertAdjacentHTML('beforeend', buildCertCard(cert, i));
  });
}

// Delete a user cert
window.deleteUserCert = function(index) {
  const saved = JSON.parse(localStorage.getItem('userCerts') || '[]');
  saved.splice(index, 1);
  localStorage.setItem('userCerts', JSON.stringify(saved));
  // Re-render all user certs
  document.querySelectorAll('.user-cert').forEach(el => el.remove());
  renderSavedCerts();
};

// Save form submission
if (certUploadForm) {
  certUploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title  = document.getElementById('certTitle').value.trim();
    const issuer = document.getElementById('certIssuer').value.trim();
    if (!title || !issuer) {
      alert('Please fill in the Certificate Title and Issued By fields.');
      return;
    }
    const newCert = {
      title,
      issuer,
      year:     document.getElementById('certYear').value.trim(),
      status:   document.getElementById('certStatus').value,
      desc:     document.getElementById('certDesc').value.trim(),
      fileData: certFileDataURL,
      fileName: certFileName
    };
    const saved = JSON.parse(localStorage.getItem('userCerts') || '[]');
    saved.push(newCert);
    localStorage.setItem('userCerts', JSON.stringify(saved));
    // Re-render
    document.querySelectorAll('.user-cert').forEach(el => el.remove());
    renderSavedCerts();
    closeModal();
  });
}

// Load saved certs on page load
renderSavedCerts();
