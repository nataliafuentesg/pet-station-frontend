import { ref, isRef, watch, onMounted, onBeforeUnmount } from 'vue'

// Lo llenado se guarda en sessionStorage: sobrevive a recargar la página o a que el celular la cierre
// en segundo plano, pero se borra al cerrar la pestaña (el formato se llena a veces en un equipo de la tienda)
const VIGENCIA_MS = 2 * 60 * 60 * 1000
// El servidor da 30 minutos para firmar después del código; se deja margen
const VERIFICACION_MS = 25 * 60 * 1000

const leer = (clave) => {
  try { return JSON.parse(sessionStorage.getItem(clave) || 'null') } catch { return null }
}

/**
 * paso: ref del paso (1 verificar, 2 datos, 3 firma, 4 listo).
 * campos: { nombre: ref o reactive } con todo lo que la persona llena (sin la firma).
 */
export function usarBorrador(tipo, paso, campos) {
  const clave = `ps_borrador_${tipo}`
  const aviso = ref('')
  let verificadoEn = 0
  let pendiente = null

  const aplicar = (datos) => {
    for (const [nombre, destino] of Object.entries(campos)) {
      if (!(nombre in datos)) continue
      if (isRef(destino)) destino.value = datos[nombre]
      else Object.assign(destino, datos[nombre])
    }
  }

  const guardado = leer(clave)
  if (guardado && Date.now() - guardado.guardadoEn < VIGENCIA_MS && guardado.paso >= 2 && guardado.paso < 4) {
    if (Date.now() - guardado.verificadoEn < VERIFICACION_MS) {
      aplicar(guardado.datos)
      verificadoEn = guardado.verificadoEn
      paso.value = 2
      aviso.value = 'Recuperamos lo que habías llenado. Revisa y continúa.'
    } else {
      // El código ya venció: se pide de nuevo y después se recupera lo llenado
      pendiente = guardado.datos
      aviso.value = 'Tenías un formato a medio llenar y tu verificación venció. Pide el código otra vez y lo recuperamos.'
    }
  }

  const guardar = () => {
    if (paso.value < 2 || paso.value >= 4) return
    const datos = {}
    for (const [nombre, origen] of Object.entries(campos)) datos[nombre] = isRef(origen) ? origen.value : origen
    try {
      sessionStorage.setItem(clave, JSON.stringify({ paso: paso.value, verificadoEn, guardadoEn: Date.now(), datos }))
    } catch { /* sin almacenamiento: solo se pierde la recuperación */ }
  }

  const borrar = () => {
    try { sessionStorage.removeItem(clave) } catch { /* sin almacenamiento */ }
  }

  watch(Object.values(campos), guardar, { deep: true })
  watch(paso, (nuevo, anterior) => {
    if (nuevo === 2 && anterior === 1) verificadoEn = Date.now()
    if (nuevo === 3 && anterior === 2) history.pushState({ pasoFormulario: 3 }, '')
    if (nuevo === 4) borrar()
    else guardar()
  })

  /** Después de verificar el código: true si había un borrador de este mismo número y se recuperó. */
  function retomar(telefono) {
    const datos = pendiente
    pendiente = null
    if (!datos || datos.form?.telefono !== telefono) return false
    aplicar(datos)
    aviso.value = 'Recuperamos lo que habías llenado. Revisa y continúa.'
    return true
  }

  /** El servidor dijo que la verificación venció: se vuelve a pedir el código sin perder lo llenado. */
  function reverificar() {
    verificadoEn = 0
    guardar()
    // Se recarga para empezar limpio: lo guardado solo se recupera si el código llega al mismo número
    location.reload()
  }

  /** Botón "Volver": de la firma a los datos, igual que el botón atrás del celular. */
  function volver() {
    if (history.state?.pasoFormulario === 3) history.back()
    else paso.value = 2
  }

  // El botón atrás del celular en la firma vuelve a los datos en vez de salir del formato
  const alRetroceder = () => { if (paso.value === 3) paso.value = 2 }
  onMounted(() => window.addEventListener('popstate', alRetroceder))
  onBeforeUnmount(() => window.removeEventListener('popstate', alRetroceder))

  return { aviso, retomar, reverificar, volver }
}
