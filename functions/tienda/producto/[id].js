export async function onRequest({ params, request, next }) {
  // Solo los crawlers de redes sociales necesitan el HTML enriquecido
  const ua = request.headers.get('user-agent') || '';
  const esCrawler = /facebookexternalhit|whatsapp|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|googlebot|bingbot/i.test(ua);

  if (!esCrawler) return next();

  const id = params.id;

  try {
    const apiRes = await fetch(`https://api.petstationvet.com/api/tienda/producto/${id}`);
    if (!apiRes.ok) return next();

    const producto = await apiRes.json();
    const nombre    = producto.nombre     || 'Producto Pet Station';
    const desc      = producto.descripcion
      ? producto.descripcion.replace(/<[^>]+>/g, '').slice(0, 160)
      : `${nombre} disponible en Pet Station, tu tienda veterinaria en Chía.`;
    const imagen    = (producto.imagenes && producto.imagenes[0]) || 'https://petstationvet.com/portada-social.jpg';
    const precio    = producto.precio ? `$${Number(producto.precio).toLocaleString('es-CO')}` : '';
    const titulo    = precio ? `${nombre} · ${precio} | Pet Station` : `${nombre} | Pet Station`;
    const pageUrl   = `https://petstationvet.com/tienda/producto/${id}`;

    const html = await next();
    const original = await html.text();

    const enriched = original
      .replace(/<title>[^<]*<\/title>/, `<title>${titulo}</title>`)
      .replace(/(<meta property="og:title"\s+content=")[^"]*"/, `$1${titulo}"`)
      .replace(/(<meta property="og:description"\s+content=")[^"]*"/, `$1${desc}"`)
      .replace(/(<meta property="og:image"\s+content=")[^"]*"/, `$1${imagen}"`)
      .replace(/(<meta property="og:url"\s+content=")[^"]*"/, `$1${pageUrl}"`)
      .replace(/(<meta name="twitter:title"\s+content=")[^"]*"/, `$1${titulo}"`)
      .replace(/(<meta name="twitter:description"\s+content=")[^"]*"/, `$1${desc}"`)
      .replace(/(<meta name="twitter:image"\s+content=")[^"]*"/, `$1${imagen}"`);

    return new Response(enriched, {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
  } catch {
    return next();
  }
}
