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

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -12%' });

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

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
