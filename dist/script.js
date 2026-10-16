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

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });

  revealTargets.forEach((element) => revealObserver.observe(element));

  const hero = document.querySelector('.hero');

  if (hero && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
      hero.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.removeProperty('--spotlight-x');
      hero.style.removeProperty('--spotlight-y');
    });
  }
}
