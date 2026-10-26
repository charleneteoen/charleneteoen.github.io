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

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Rotating headline word
const rotator = document.querySelector('.rotator');
if (rotator && !reduceMotion) {
  const words = rotator.dataset.words.split(',');
  const hidden = { opacity: 0, filter: 'blur(8px)' };
  const shown = { opacity: 1, filter: 'blur(0)', transform: 'none' };
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    rotator.animate([shown, { ...hidden, transform: 'translateY(-30%)' }], { duration: 350, easing: 'ease-in', fill: 'forwards' })
      .onfinish = () => {
        rotator.textContent = words[i];
        rotator.animate([{ ...hidden, transform: 'translateY(30%)' }, shown], { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
      };
  }, 2600);
}

// Count-up numbers
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    countIO.unobserve(target);
    const to = +target.dataset.to;
    if (reduceMotion) { target.textContent = to; return; }
    const start = performance.now(), dur = 1600;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      target.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.count').forEach((el) => countIO.observe(el));

// Card spotlight follows the cursor
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
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
