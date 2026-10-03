// One scroll button. The arrow points down until you reach the bottom,
// then flips up. It stays hidden if the page is too short to scroll.
(() => {
  'use strict';

  const btn = document.getElementById('scrollBtn');
  if (!btn) return;

  const root = document.documentElement;
  const BUFFER = 10; // absorbs sub-pixel rounding differences between browsers
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let atBottom = null;
  let queued = false;

  const canScroll = () => root.scrollHeight > window.innerHeight + BUFFER;
  const isAtBottom = () =>
    window.innerHeight + window.scrollY >= root.scrollHeight - BUFFER;

  function update() {
    queued = false;
    btn.hidden = !canScroll();

    const now = isAtBottom();
    if (now === atBottom) return; // nothing changed, so skip the DOM writes
    atBottom = now;
    btn.dataset.direction = now ? 'up' : 'down';
    btn.setAttribute('aria-label', now ? 'Scroll to top' : 'Scroll to bottom');
  }

  // Scroll fires many times per frame. Run at most once per frame.
  function requestUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: isAtBottom() ? 0 : root.scrollHeight,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();
