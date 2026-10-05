export function useSeo({ titulo, descripcion, url }) {
    document.title = titulo;

    const setMeta = (selector, attr, value) => {
        let el = document.querySelector(selector);
        if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', descripcion);
    setMeta('meta[property="og:title"]', 'content', titulo);
    setMeta('meta[property="og:description"]', 'content', descripcion);
    setMeta('meta[property="twitter:title"]', 'content', titulo);
    setMeta('meta[property="twitter:description"]', 'content', descripcion);
    if (url) {
        setMeta('meta[property="og:url"]', 'content', url);
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', url);
    }
}
