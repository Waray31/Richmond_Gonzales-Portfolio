/* ═══════════════════════════════════════════════════
   RICHMOND GONZALES | QA PORTFOLIO — script.js
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── FOOTER YEAR ────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── CACHE ALL DOM REFERENCES FIRST ─────────────── */
  const navbar     = document.getElementById('navbar');
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('section[id]');
  const scrollBtn  = document.getElementById('scroll-top');
  const hamburger  = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');
  const themeBtn   = document.getElementById('theme-toggle');
  const themeIcon  = document.getElementById('theme-icon');
  const sendBtn    = document.getElementById('send-btn');
  const formSuccess = document.getElementById('form-success');
  const nameEl     = document.getElementById('name');
  const emailEl    = document.getElementById('email');
  const msgEl      = document.getElementById('message');
  const tcFilters  = document.querySelectorAll('.tc-filter');
  const tcRows     = document.querySelectorAll('.tc-table tbody tr');
  const bars       = document.querySelectorAll('.bar-fill');

  // AOS elements — must be declared before onScroll is called
  const aosEls = document.querySelectorAll('[data-aos]');

  /* ── AOS (ANIMATE ON SCROLL) ────────────────────── */
  function animateOnScroll() {
    aosEls.forEach(el => {
      if (el.classList.contains('aos-animate')) return;
      const rect  = el.getBoundingClientRect();
      const delay = parseInt(el.getAttribute('data-delay') || 0, 10);
      if (rect.top < window.innerHeight - 70) {
        setTimeout(() => el.classList.add('aos-animate'), delay);
      }
    });
  }

  /* ── SKILL BARS ─────────────────────────────────── */
  let barsTriggered = false;
  function triggerSkillBars() {
    if (barsTriggered) return;
    const sec = document.getElementById('skills');
    if (!sec) return;
    if (sec.getBoundingClientRect().top < window.innerHeight - 80) {
      barsTriggered = true;
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        }, i * 130);
      });
    }
  }

  /* ── NAVBAR / SCROLL HANDLER ────────────────────── */
  function onScroll() {
    const y = window.scrollY;

    navbar.classList.toggle('scrolled', y > 40);
    scrollBtn?.classList.toggle('visible', y > 400);

    // Active nav link highlight
    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    // These are now safe — declared above
    animateOnScroll();
    triggerSkillBars();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // safe to call now — all vars declared

  /* ── HAMBURGER MENU ─────────────────────────────── */
  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open', open);
  });
  navLinks.forEach(l => l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  }));

  /* ── DARK / LIGHT MODE ──────────────────────────── */
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
  }
  themeBtn?.addEventListener('click', () => {
    const light = document.body.classList.toggle('light-mode');
    if (themeIcon) themeIcon.className = light ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    localStorage.setItem('theme', light ? 'light' : 'dark');
  });

  /* ── SCROLL TO TOP ──────────────────────────────── */
  scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── TEST CASE FILTER ───────────────────────────── */
  function updateTcSummary() {
    const visible = [...tcRows].filter(r => !r.classList.contains('hidden'));
    const passed  = visible.filter(r => r.querySelector('.status-badge.pass')).length;
    const failed  = visible.filter(r => r.querySelector('.status-badge.fail')).length;
    const pct     = visible.length ? Math.round((passed / visible.length) * 100) + '%' : '0%';
    const stats   = document.querySelectorAll('.tc-stat-num');
    if (stats.length >= 4) {
      stats[0].textContent = visible.length;
      stats[1].textContent = passed;
      stats[2].textContent = failed;
      stats[3].textContent = pct;
    }
  }

  tcFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      tcFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      tcRows.forEach(row => {
        row.classList.toggle(
          'hidden',
          filter !== 'all' && row.getAttribute('data-category') !== filter
        );
      });
      updateTcSummary();
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  /* ── TERMINAL TYPEWRITER ────────────────────────── */
  document.querySelectorAll('.t-line .t-pass').forEach((el, i) => {
    const row = el.closest('.t-line');
    if (!row) return;
    row.style.opacity = '0';
    setTimeout(() => {
      row.style.transition = 'opacity 0.4s';
      row.style.opacity = '1';
    }, 900 + i * 220);
  });

  /* ── CONTACT FORM ───────────────────────────────── */
  function shake(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 600);
  }

  sendBtn?.addEventListener('click', () => {
    const name    = nameEl?.value.trim();
    const email   = emailEl?.value.trim();
    const msg     = msgEl?.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    let valid = true;

    // Reset border colors
    [nameEl, emailEl, msgEl].forEach(el => { if (el) el.style.borderColor = ''; });

    if (!name)    { nameEl.style.borderColor  = 'var(--red)'; valid = false; }
    if (!emailOk) { emailEl.style.borderColor = 'var(--red)'; valid = false; }
    if (!msg)     { msgEl.style.borderColor   = 'var(--red)'; valid = false; }

    // Clear red border on focus
    [nameEl, emailEl, msgEl].forEach(el => {
      el?.addEventListener('focus', () => { el.style.borderColor = ''; }, { once: true });
    });

    if (!valid) { shake(sendBtn); return; }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    setTimeout(() => {
      sendBtn.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'flex';
      [nameEl, emailEl, msgEl, document.getElementById('subject')].forEach(el => {
        if (el) el.value = '';
      });
    }, 1500);
  });

  /* ── SMOOTH ANCHOR SCROLL ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});

/* ── SHAKE KEYFRAME (injected outside DOMContentLoaded) ── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-6px); }
    40%,80%  { transform: translateX(6px); }
  }
  .shake { animation: shake .5s ease; }
`;
document.head.appendChild(shakeStyle);
