const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const revealGroups = [
    '.hero-copy > *',
    '.hero-aside',
    '.section-heading > *',
    '.project-card',
    '.small-project',
    '.timeline-item',
    '.principles > div:first-child',
    '.motto',
    '.principle-grid article',
    '.contact > *'
  ];

  const revealTargets = document.querySelectorAll(revealGroups.join(','));
  const heroTargets = [];
  const scrollTargets = [];

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 110}ms`);

    if (element.matches('.section-heading > div, .principles > div:first-child, .motto')) {
      element.classList.add('reveal-left');
    } else if (element.matches('.section-heading > p')) {
      element.classList.add('reveal-right');
    } else {
      element.classList.add('reveal-up');
    }

    if (element.closest('.hero')) {
      heroTargets.push(element);
    } else {
      element.classList.add('scroll-controlled');
      element.dataset.revealStagger = String((index % 3) * 0.07);
      scrollTargets.push(element);
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8%' });

    heroTargets.forEach((element) => revealObserver.observe(element));
  } else {
    heroTargets.forEach((element) => element.classList.add('is-visible'));
  }

  let scrollFrame;

  const updateScrollMotion = () => {
    const viewportHeight = window.innerHeight;
    const revealStart = viewportHeight * 0.94;
    const revealEnd = viewportHeight * 0.54;
    const revealDistance = revealStart - revealEnd;

    scrollTargets.forEach((element) => {
      if (element.dataset.revealComplete === 'true') return;

      const bounds = element.getBoundingClientRect();
      const stagger = Number(element.dataset.revealStagger || 0);
      const rawProgress = (revealStart - bounds.top) / revealDistance;
      const progress = Math.min(1, Math.max(0, (rawProgress - stagger) / (1 - stagger)));

      if (progress <= 0) return;

      const remaining = 1 - progress;
      let x = 0;
      let y = 0;
      let scale = 1;
      let clipPath = 'inset(0 0 0 0)';

      if (element.classList.contains('reveal-left')) {
        x = -82 * remaining;
        clipPath = `inset(0 ${18 * remaining}% 0 0)`;
      } else if (element.classList.contains('reveal-right')) {
        x = 82 * remaining;
        clipPath = `inset(0 0 0 ${18 * remaining}%)`;
      } else {
        y = 96 * remaining;
        scale = 0.95 + (0.05 * progress);
        clipPath = `inset(0 0 ${25 * remaining}% 0 round 14px)`;
      }

      element.style.opacity = progress.toFixed(3);
      element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      element.style.clipPath = clipPath;

      if (progress >= 0.999) {
        element.dataset.revealComplete = 'true';
        element.classList.add('is-visible');
        requestAnimationFrame(() => {
          element.classList.remove('scroll-controlled');
          element.style.removeProperty('opacity');
          element.style.removeProperty('transform');
          element.style.removeProperty('clip-path');
        });
      }
    });

    const scrollableHeight = document.documentElement.scrollHeight - viewportHeight;
    const pageProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    document.documentElement.style.setProperty('--page-progress', String(Math.min(1, Math.max(0, pageProgress))));
    scrollFrame = undefined;
  };

  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScrollMotion);
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  requestScrollUpdate();

  const hero = document.querySelector('.hero');

  if (hero && window.matchMedia('(pointer: fine)').matches) {
    let spotlightFrame;
    let spotlightX = 0;
    let spotlightY = 0;

    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      spotlightX = event.clientX - bounds.left;
      spotlightY = event.clientY - bounds.top;

      if (spotlightFrame) return;

      spotlightFrame = requestAnimationFrame(() => {
        hero.style.setProperty('--spotlight-x', `${spotlightX}px`);
        hero.style.setProperty('--spotlight-y', `${spotlightY}px`);
        spotlightFrame = undefined;
      });
    });

    hero.addEventListener('pointerleave', () => {
      if (spotlightFrame) cancelAnimationFrame(spotlightFrame);
      spotlightFrame = undefined;
      hero.style.removeProperty('--spotlight-x');
      hero.style.removeProperty('--spotlight-y');
    });
  }
}
