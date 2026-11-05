// Toma varias lecturas del GPS y se queda con las mejores: la primera suele venir de la red (cientos de metros)
// y las siguientes se van afinando con el GPS. Termina apenas logra buena precisión o al agotar el tiempo.
const CODIGOS = { 1: 'DENEGADO', 2: 'NO_DISPONIBLE', 3: 'TIEMPO' }

export function obtenerUbicacion({ objetivo = 15, minLecturas = 2, maxSeg = 20, onProgreso } = {}) {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve({ error: 'NO_SOPORTADO' })
    const lecturas = []
    const inicio = Date.now()
    let terminado = false
    let watchId = null
    let timer = null

    const terminar = errorCodigo => {
      if (terminado) return
      terminado = true
      if (watchId != null) navigator.geolocation.clearWatch(watchId)
      clearTimeout(timer)
      if (!lecturas.length) {
        // Solo marcar como DENEGADO si el sistema confirma que el permiso fue negado
        // y no han pasado más de 3 s (error temprano = permiso real; error tardío = GPS lento)
        const esDenegado = errorCodigo === 1 && Date.now() - inicio < 3000
        return resolve({ error: esDenegado ? 'DENEGADO' : CODIGOS[errorCodigo] || 'TIEMPO' })
      }
      resolve(promediar(lecturas))
    }

    watchId = navigator.geolocation.watchPosition(
      p => {
        lecturas.push({ lat: p.coords.latitude, lon: p.coords.longitude, precision: p.coords.accuracy })
        const mejor = Math.min(...lecturas.map(l => l.precision))
        onProgreso?.({ precision: Math.round(mejor), lecturas: lecturas.length })
        if (mejor <= objetivo && lecturas.length >= minLecturas) terminar()
      },
      e => {
        // Code 1 = permiso denegado: terminar siempre. Code 2/3 = GPS lento: solo terminar si no hay lecturas y ya pasó el tiempo.
        if (e.code === 1) terminar(e.code)
        else if (!lecturas.length && Date.now() - inicio > maxSeg * 1000) terminar(e.code)
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: maxSeg * 1000 },
    )
    timer = setTimeout(() => terminar(3), maxSeg * 1000)
  })
}

// Promedio ponderado de las lecturas cercanas a la mejor: las imprecisas casi no pesan
function promediar(lecturas) {
  const mejor = Math.min(...lecturas.map(l => l.precision))
  const buenas = lecturas.filter(l => l.precision <= Math.max(mejor * 1.5, mejor + 5))
  let w = 0, lat = 0, lon = 0
  for (const l of buenas) {
    const p = 1 / (l.precision * l.precision)
    w += p; lat += l.lat * p; lon += l.lon * p
  }
  return { lat: lat / w, lon: lon / w, precision: Math.round(mejor), lecturas: lecturas.length }
}

// Para marcar jornada: el permiso se pide una sola vez por celular. Después solo se toma la ubicación si ya está
// permitida, porque algunos celulares vuelven a preguntar cada vez y el navegador no deja evitarlo de otra forma.
const YA_PREGUNTADO = 'jornada-ubicacion-preguntada'

export async function estadoPermisoUbicacion() {
  let estado = null
  try {
    estado = (await navigator.permissions.query({ name: 'geolocation' })).state
  } catch { /* navegador sin esta consulta */ }
  if (estado === 'granted' || estado === 'denied') return estado
  try {
    if (localStorage.getItem(YA_PREGUNTADO)) return 'no-preguntar'
    localStorage.setItem(YA_PREGUNTADO, '1')
  } catch {
    return 'no-preguntar'
  }
  return 'prompt'
}
