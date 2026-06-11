/* ─────────────────────────────────────────────────────────
   main.js — Portfolio Julien Jegu · BTS SIO SISR
   Utilitaires partagés entre toutes les pages
───────────────────────────────────────────────────────── */

// ─── Loader ───
(function () {
  const el = document.getElementById('lpct');
  if (!el) return;
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(n + Math.floor(Math.random() * 12) + 4, 100);
    el.textContent = String(n).padStart(3, '0') + '%';
    if (n >= 100) clearInterval(iv);
  }, 60);
})();

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1400);
});

// ─── Barre de progression (scroll) ───
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  const updateProgress = () => {
    const scrolled = document.documentElement.scrollTop;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
}

// ─── Navigation — frost au défilement ───
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ─── Lien actif dans la navigation ───
(function () {
  const filename = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (
      href === filename ||
      (filename === '' && href === 'index.html') ||
      (filename === 'index.html' && href === 'index.html')
    ) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// ─── Révélation au défilement (IntersectionObserver) ───
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(
        () => e.target.classList.add('visible'),
        parseFloat(e.target.dataset.delay || 0)
      );
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => {
  const siblings = Array.from(el.parentNode.children).filter(c => c.classList.contains('reveal'));
  el.dataset.delay = siblings.indexOf(el) * 80;
  revealObs.observe(el);
});

// ─── Compteurs animés ───
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
    counterObs.unobserve(el);
  });
}, { threshold: .5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ─── Onglets NexaTech (nexatech.html uniquement) ───
document.querySelectorAll('.nt-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nt-tab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.nt-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const pane = document.getElementById('tab-' + btn.dataset.tab);
    if (pane) pane.classList.add('active');
  });
});
