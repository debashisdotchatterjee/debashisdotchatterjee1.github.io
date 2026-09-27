(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('dc-theme');
  if (saved) root.dataset.theme = saved;

  const themeButton = document.querySelector('.theme-toggle');
  const setThemeIcon = () => {
    if (!themeButton) return;
    themeButton.textContent = root.dataset.theme === 'dark' ? '☀' : '◐';
  };
  setThemeIcon();
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('dc-theme', next);
    setThemeIcon();
  });

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const progress = document.createElement('div');
  progress.id = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    progress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  const revealTargets = document.querySelectorAll('.section-heading,.topic-card,.feature-block,.publication-card,.dark-card,.working-card,.mentor-card,.talk-list article,.cv-section,.cv-block,.timeline>div');
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4) el.classList.add(`reveal-delay-${i % 4}`);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -40px'});
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  const search = document.getElementById('pub-search');
  const chips = [...document.querySelectorAll('.chip[data-year]')];
  const pubs = [...document.querySelectorAll('.pub-full[data-year]')];
  const empty = document.getElementById('pub-empty');
  let year = 'all';
  const filter = () => {
    const q = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    pubs.forEach(card => {
      const y = Number(card.dataset.year);
      const yearOk = year === 'all' || (year === 'earlier' ? y < 2024 : String(y) === year);
      const textOk = !q || (card.dataset.search || card.textContent.toLowerCase()).includes(q);
      const show = yearOk && textOk;
      card.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  };
  search?.addEventListener('input', filter);
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    year = chip.dataset.year;
    filter();
  }));
})();
