// Optional reveal animation. If JS is unavailable, the section remains visible.
(() => {
  const section = document.querySelector('.about-section');
  if (!section || !('IntersectionObserver' in window)) return;
  section.classList.add('about-motion');
  const items = section.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
})();
