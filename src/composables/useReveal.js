export function useReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (reduced) el.classList.add('is-visible');
    else observer.observe(el);
  });
}
