export function useJsonLd(data) {
  const existing = document.getElementById('jsonld-page');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = 'jsonld-page';
  script.type = 'application/ld+json';
  script.textContent = Array.isArray(data) ? JSON.stringify(data) : JSON.stringify(data);
  document.head.appendChild(script);
}
