/* Studio 410 — interactions */
(() => {
  'use strict';

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---- Active nav link ---- */
  const links = [...document.querySelectorAll('.rail-nav a')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const nav = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => nav.observe(s));
  }

  /* ---- Before / after slider ---- */
  const compare = document.getElementById('compare');
  const range = document.getElementById('c-range');
  if (compare && range) {
    const set = (v) => compare.style.setProperty('--pos', `${v}%`);
    set(range.value);
    range.addEventListener('input', () => set(range.value));

    const fromPointer = (clientX) => {
      const r = compare.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
      range.value = pct;
      set(pct);
    };
    let dragging = false;
    compare.addEventListener('pointerdown', (e) => { dragging = true; fromPointer(e.clientX); });
    window.addEventListener('pointermove', (e) => { if (dragging) fromPointer(e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; });
  }

  /* ---- Lightbox ---- */
  const tiles = [...document.querySelectorAll('.tile')];
  const box = document.getElementById('lightbox');
  const boxImg = document.getElementById('lb-img');
  const boxCap = document.getElementById('lb-cap');
  let index = 0;

  const show = (i) => {
    index = (i + tiles.length) % tiles.length;
    const img = tiles[index].querySelector('img');
    const caps = [...tiles[index].querySelectorAll('figcaption span')].map((s) => s.textContent.trim());
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
    boxCap.textContent = caps.join(' — ');
  };
  const open = (i) => { show(i); box.hidden = false; document.body.style.overflow = 'hidden'; };
  const close = () => { box.hidden = true; boxImg.src = ''; document.body.style.overflow = ''; };

  tiles.forEach((t, i) => {
    t.setAttribute('tabindex', '0');
    t.setAttribute('role', 'button');
    t.addEventListener('click', () => open(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
  document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });
  box.addEventListener('click', (e) => { if (e.target === box || e.target === boxImg) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
