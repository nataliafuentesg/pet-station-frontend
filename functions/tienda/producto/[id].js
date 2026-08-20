export async function onRequest({ params, request, next }) {
  const ua = request.headers.get('user-agent') || '';
  const esCrawler = /facebookexternalhit|whatsapp|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|googlebot|bingbot/i.test(ua);

  if (!esCrawler) return next();

  const id = params.id;

  let titulo = 'Pet Station | Tienda Veterinaria en Chía';
  let desc   = 'Encuentra todo para tu mascota en Pet Station, Chía.';
  let imagen = 'https://petstationvet.com/portada-social.jpg';
  let pageUrl = `https://petstationvet.com/tienda/producto/${id}`;

  try {
    // El slug tiene formato "nombre-del-producto-UUID" — extraemos solo el UUID (último segmento de 36 chars)
    const uuidMatch = id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const productId = uuidMatch ? uuidMatch[0] : id;
    const apiRes = await fetch(`https://api.petstationvet.com/api/tienda/productos/${productId}`);
    if (apiRes.ok) {
      const p = await apiRes.json();
      const nombre = p.nombre || 'Producto';
      const precio = p.precio ? ` · $${Number(p.precio).toLocaleString('es-CO')}` : '';
      titulo = `${nombre}${precio} | Pet Station`;
      desc   = p.descripcion
        ? p.descripcion.replace(/<[^>]+>/g, '').slice(0, 160)
        : `${nombre} disponible en Pet Station, tu tienda veterinaria en Chía.`;
      imagen = (p.fotosUrls && p.fotosUrls[0]) || imagen;
    }
  } catch (_) {}

  const response = await next();

  return new HTMLRewriter()
    .on('title', { element(el) { el.setInnerContent(titulo); } })
    .on('meta[name="description"]',           { element(el) { el.setAttribute('content', desc); } })
    .on('meta[property="og:title"]',          { element(el) { el.setAttribute('content', titulo); } })
    .on('meta[property="og:description"]',    { element(el) { el.setAttribute('content', desc); } })
    .on('meta[property="og:image"]',          { element(el) { el.setAttribute('content', imagen); } })
    .on('meta[property="og:url"]',            { element(el) { el.setAttribute('content', pageUrl); } })
    .on('meta[name="twitter:title"]',         { element(el) { el.setAttribute('content', titulo); } })
    .on('meta[name="twitter:description"]',   { element(el) { el.setAttribute('content', desc); } })
    .on('meta[name="twitter:image"]',         { element(el) { el.setAttribute('content', imagen); } })
    .transform(response);
}
