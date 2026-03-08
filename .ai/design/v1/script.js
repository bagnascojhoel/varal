/* ─── Theme toggle ─── */

(function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const sky = document.querySelector('.sky');
  const icon = btn.querySelector('.theme-icon');

  function apply(mode) {
    if (mode === 'light') {
      sky.classList.add('light');
      icon.textContent = '🌙';
      btn.setAttribute('aria-label', 'Mudar para tema escuro');
    } else {
      sky.classList.remove('light');
      icon.textContent = '☀️';
      btn.setAttribute('aria-label', 'Mudar para tema claro');
    }
    localStorage.setItem('theme', mode);
  }

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  btn.addEventListener('click', function () {
    apply(sky.classList.contains('light') ? 'dark' : 'light');
  });
})();

/* ─── Rain ─── */

(function spawnRain() {
  const layer = document.getElementById('rain');
  const COUNT = 90;

  for (let i = 0; i < COUNT; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';

    const height = Math.random() * 80 + 40; // 40 – 120 px
    const left = Math.random() * 110 - 5; // –5 % to 105 %
    const duration = Math.random() * 0.9 + 0.5; // 0.5 – 1.4 s
    const delay = Math.random() * 4; // stagger across 4 s
    const opacity = Math.random() * 0.45 + 0.15; // 0.15 – 0.6

    drop.style.cssText = [
      `height:${height}px`,
      `left:${left}%`,
      `animation-duration:${duration}s`,
      `animation-delay:-${delay}s`,
      `opacity:${opacity}`,
    ].join(';');

    layer.appendChild(drop);
  }
})();

/* ─── Live date in header ─── */

(function setDate() {
  const el = document.getElementById('current-date');
  if (!el) return;

  const now = new Date();
  const formatted = now.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  // Capitalise first letter, strip trailing dot if locale adds one
  el.textContent = formatted
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\.$/, '');
})();

/* ─── Day labels relative to today ─── */

(function setDayLabels() {
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  const today = new Date();

  [0, 1, 2].forEach((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);

    const weekdayEl = document.getElementById(`weekday-${offset}`);
    if (weekdayEl) weekdayEl.textContent = days[d.getDay()];
  });
})();
