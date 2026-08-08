/* progress bar */
(function () {
  const bar = document.getElementById('bar');
  const pct = document.getElementById('pct');
  let n = 0;
  const go = () => {
    if (n >= 67) return;
    n++;
    bar.style.width = n + '%';
    pct.textContent = n + '%';
    setTimeout(go, 22);
  };
  setTimeout(go, 400);
})();

/* typewriter — cmd1 */
(function () {
  const el = document.getElementById('cmd1');
  const txt = el.textContent;
  el.textContent = '';
  let i = 0;
  const go = () => { el.textContent = txt.slice(0, ++i); if (i < txt.length) setTimeout(go, 55); };
  setTimeout(go, 100);
})();

/* typewriter — cmd2 (pip install), starts after a delay */
(function () {
  const el = document.getElementById('cmd2');
  const txt = el.textContent;
  el.textContent = '';
  let i = 0;
  const go = () => { el.textContent = txt.slice(0, ++i); if (i < txt.length) setTimeout(go, 55); };
  setTimeout(go, 1800);

  /* reveal pip output lines one by one after typing finishes */
  const out = document.querySelectorAll('.pip-out > div');
  out.forEach(el => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; });
  const delays = [2900, 3200, 3500, 3900, 4200];
  out.forEach((el, i) => setTimeout(() => { el.style.opacity = '1'; }, delays[i]));

  /* pip bar */
  setTimeout(() => document.getElementById('pip-bar').classList.add('visible'), 3500);
})();

/* spinner on running task */
(function () {
  const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
  const el = document.getElementById('spinner');
  let f = 0;
  setInterval(() => { el.textContent = frames[f = (f+1) % frames.length]; }, 100);
})();

/* GTA badge cycling */
(function () {
  const badge = document.getElementById('gta-badge');
  const states = ['hopefully','maybe?','probably','fingers crossed','🤞','soon™','we\'ll see'];
  let i = 0;
  setInterval(() => { badge.textContent = states[i = (i+1) % states.length]; }, 2200);
})();

/* blinking cursor */
// (handled by CSS animation)
