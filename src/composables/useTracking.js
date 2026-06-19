/**
 * Composable centralizado de tracking.
 * Dispara eventos hacia GTM (dataLayer) y Meta Pixel (fbq) simultáneamente.
 * Úsalo en cualquier componente: const { track } = useTracking()
 */
export function useTracking() {

  const pushGTM = (eventName, params = {}) => {
    if (window.dataLayer) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  };

  const pushMeta = (eventName, params = {}, eventID = null) => {
    if (window.fbq) {
      const options = eventID ? { eventID } : {};
      window.fbq('track', eventName, params, options);
    }
  };

  const track = (gtmEvent, metaEvent, params = {}, eventID = null) => {
    pushGTM(gtmEvent, params);
    if (metaEvent) pushMeta(metaEvent, params, eventID);
  };

  // ─────────────────────────────────────────
  // Eventos específicos de Pet Station
  // ─────────────────────────────────────────

  const trackViewService = (servicio) => {
    track('view_service', 'ViewContent', {
      content_type: 'service',
      content_name: servicio,
    });
  };

  const trackSelectTalla = (talla, precio) => {
    pushGTM('select_talla_peluqueria', { talla, precio_base: precio });
  };

  const trackClickAgendarCita = (servicio, origen = '') => {
    track('click_agendar_cita', 'Lead', {
      servicio,
      origen,
    });
  };

  const trackCitaAgendada = (servicio, especie, metodo) => {
    track('conversion_cita', 'Lead', {
      servicio_tipo: servicio,
      mascota_especie: especie,
      metodo,
    });
  };

  const trackInicioCheckout = (total, items) => {
    track('begin_checkout', 'InitiateCheckout', {
      value: total,
      currency: 'COP',
      num_items: items,
    });
  };

  const trackCompraCompletada = (total, items, codigoPedido = null) => {
    // eventID = mismo que manda el servidor ("Purchase-PED-123") para deduplicar
    const eventID = codigoPedido ? `Purchase-PED-${codigoPedido.replace('PS-2026-', '')}` : null;
    track('purchase', 'Purchase', {
      value: total,
      currency: 'COP',
      num_items: items,
    }, eventID);
  };

  const trackRegistro = (metodo = 'email') => {
    track('sign_up', 'CompleteRegistration', {
      metodo,
      currency: 'COP',
      value: 0,
    });
  };

  const trackLogin = (metodo = 'email') => {
    pushGTM('login', { metodo });
  };

  const trackAddToCart = (producto) => {
    track('add_to_cart', 'AddToCart', {
      content_ids: [producto.id],
      content_name: producto.nombre,
      content_type: 'product',
      value: producto.precio,
      currency: 'COP',
    });
  };

  return {
    track,
    trackViewService,
    trackSelectTalla,
    trackClickAgendarCita,
    trackCitaAgendada,
    trackInicioCheckout,
    trackCompraCompletada,
    trackRegistro,
    trackLogin,
    trackAddToCart,
  };
}
