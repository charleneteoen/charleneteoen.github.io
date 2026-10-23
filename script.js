// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Nav border on scroll
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });

// Theme toggle (remembered per browser)
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = isDark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

// Project filters
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((c) => c.classList.toggle('is-active', c === chip));
  const f = chip.dataset.filter;
  cards.forEach((card) => {
    card.classList.toggle('is-hidden', f !== 'all' && !card.dataset.tags.includes(f));
  });
}));

// Project modal
const modal = document.querySelector('.modal');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalBody = document.getElementById('modal-body');

function openProject(card) {
  modalTitle.textContent = card.querySelector('h3').textContent;
  modalMeta.textContent = card.querySelector('.card-meta').textContent;
  modalBody.innerHTML = card.querySelector('.detail').innerHTML;
  modal.showModal();
  modal.scrollTop = 0;
}

cards.forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openProject(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card); }
  });
});

modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
// Close when clicking the backdrop (outside the dialog box)
modal.addEventListener('click', (e) => {
  const r = modal.getBoundingClientRect();
  const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (outside) modal.close();
});
