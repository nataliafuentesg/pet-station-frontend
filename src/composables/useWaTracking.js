import api from '@/api/axios'

function detectarFuente() {
  const params = new URLSearchParams(window.location.search)
  const utmSource = params.get('utm_source')
  const utmMedium = params.get('utm_medium')
  const utmCampaign = params.get('utm_campaign')

  if (utmSource) {
    return { fuente: utmSource, medio: utmMedium || '', campana: utmCampaign || '' }
  }

  const ref = document.referrer
  if (!ref) return { fuente: 'direct', medio: '', campana: '' }

  try {
    const host = new URL(ref).hostname
    if (host.includes('google')) return { fuente: 'google', medio: 'organic', campana: '' }
    if (host.includes('facebook') || host.includes('fb.com')) return { fuente: 'facebook', medio: 'social', campana: '' }
    if (host.includes('instagram')) return { fuente: 'instagram', medio: 'social', campana: '' }
    if (host.includes('tiktok')) return { fuente: 'tiktok', medio: 'social', campana: '' }
    if (host.includes('youtube')) return { fuente: 'youtube', medio: 'social', campana: '' }
    if (host.includes('whatsapp')) return { fuente: 'whatsapp', medio: 'messaging', campana: '' }
    return { fuente: host, medio: 'referral', campana: '' }
  } catch {
    return { fuente: 'direct', medio: '', campana: '' }
  }
}

export function useWaTracking() {
  const trackWaClick = (pagina = window.location.pathname) => {
    const { fuente, medio, campana } = detectarFuente()
    api.post('/tracking/wa-click', {
      pagina,
      fuente,
      medio,
      campana,
      referrer: document.referrer,
    }).catch(() => {})
  }

  const trackView = (tipo, nombre, slug) => {
    const { fuente } = detectarFuente()
    api.post('/tracking/view', {
      tipo,
      nombre,
      slug: slug || '',
      fuente,
      referrer: document.referrer,
    }).catch(() => {})
  }

  return { trackWaClick, trackView }
}
