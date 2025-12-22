export const services = [
  {
    slug: 'consulta',
    title: 'Consulta Médica',
    icon: 'bi bi-heart-pulse',
    category: 'Salud',
    intro: 'Evaluación completa, diagnóstico y plan de manejo personalizado.',
    longDesc: 'De nariz a cola, evaluamos cada sistema. Los costos se confirman tras la valoración clínica.',
    motivos: [
      { id: 'vomito', label: 'Vómito' }, { id: 'diarrea', label: 'Diarrea' },
      { id: 'piel', label: 'Alergia/Piel' }, { id: 'oidos', label: 'Oídos/Olor' },
      { id: 'dolor', label: 'Cojea/Dolor' }, { id: 'tos', label: 'Tos/Estornudos' },
      { id: 'apetito', label: 'No come/Bebe mucho' }, { id: 'chequeo', label: 'Chequeo anual' },
      { id: 'vacunas', label: 'Vacunas/Desparasitación' }
    ],
    bloques: [
      {
        titulo: 'Lo que ofrecemos',
        items: [
          { t: 'Chequeo completo', d: 'Historia clínica, examen físico de nariz a cola y plan de manejo.' },
          { t: 'Vacunas y desparasitación', d: 'Actualización de esquema para perros y gatos según edad.' },
          { t: 'Pulgas y garrapatas', d: 'Prevención, pruebas y tratamiento de enfermedades por vectores.' },
          { t: 'Piel, oídos y ojos', d: 'Dermatología, otitis y oftalmología según valoración.' },
          { t: 'Interconsultas y cirugía', d: 'Remisión o manejo quirúrgico cuando está indicado.' }
        ]
      },
      {
        titulo: 'Cómo te atendemos',
        pasos: [
          '1. Primer contacto: Orientación por WhatsApp y disponibilidad.',
          '2. Consulta: Examen físico y si se requiere, laboratorios o imágenes.',
          '3. Plan de manejo: Tratamiento y acompañamiento en recuperación.'
        ]
      }
    ],
    queTraer: [
      'Historial y fórmulas médicas previas.',
      'Medicamentos actuales (Nombre y dosis).',
      'Muestras recientes o fotos de síntomas/lesiones.'
    ],
    waMsg: 'Hola Pet Station, necesito una consulta médica.'
  },
  {
    slug: 'viajes',
    title: 'Trámites de Viaje',
    icon: 'bi bi-airplane',
    category: 'Trámites',
    intro: 'Certificados, serologías, microchip ISO y gestión ICA (CIS).',
    longDesc: 'Te asesoramos según destino y aerolínea. Recomendamos iniciar 4-8 semanas antes (o 3 meses para ciertos destinos).',
    tabs: [
      {
        id: 'usa',
        label: '🇺🇸 EE. UU.',
        content: 'Requisitos sujetos a CDC/USDA. Importante: Si es la primera antirrábica, hay ventanas de tiempo obligatorias.',
        guia: [
          { p: 'Asesoría Inicial', d: 'Día 0: Verificación de ruta y requerimientos vigentes.' },
          { p: 'Vacunación', d: 'Esquema antirrábico vigente según normas del destino.' },
          { p: 'Microchip ISO', d: 'Implantación y registro compatible 11784/11785.' },
          { p: 'Serología (Crítico)', d: 'Toma de muestra para anticuerpos de Rabia si el historial o ruta lo exige.' },
          { p: 'Certificado Médico', d: 'Examen clínico internacional con soporte documental.' },
          { p: 'Gestión ICA', d: 'Cargue en SISPAP para obtener el CIS de salida.' }
        ]
      },
      {
        id: 'europa',
        label: '🇪🇺 Europa / 🇨🇱 Chile',
        content: 'Destinos que exigen obligatoriamente la prueba de anticuerpos (Serología).',
        pasos: [
          'Microchip ISO (Debe ser implantado ANTES de la vacuna de rabia).',
          'Vacuna de Rabia vigente.',
          'Toma de muestra para Serología (Mínimo 30 días después de vacunar).',
          'Espera de 3 meses tras el resultado para poder viajar (Europa).'
        ]
      },
      {
        id: 'nacional',
        label: '🇨🇴 Nacional',
        content: 'Viajes dentro de Colombia.',
        items: ['Certificado médico nacional', 'Carné de vacunas al día', 'Desparasitación vigente']
      }
    ],
    waMsg: 'Hola Pet Station, asesoría para viajes.'
  },
  {
    slug: 'rx',
    title: 'Rayos X e Imágenes',
    icon: 'bi bi-camera',
    category: 'Diagnóstico',
    intro: 'Ayudas diagnósticas para evaluar estructuras óseas y órganos internos.',
    longDesc: 'Servicio bajo remisión médica o valoración interna para diagnósticos precisos.',
    especificaciones: [
      { t: 'Rayos X', d: 'Evaluación de fracturas, tórax, abdomen y displasias.' },
      { t: 'Ecografía', d: 'Valoración abdominal detallada y tejidos blandos (Previa cita).' },
      { t: 'Odontología', d: 'Profilaxis dental y extracciones con soporte de imagen.' }
    ],
    preparacion: [
      'Ayuno de 8 horas si se requiere sedación para la toma.',
      'Traer orden médica si viene remitido de otra clínica.',
      'Cita previa requerida para ecografía especializada.'
    ],
    waMsg: 'Hola Pet Station, necesito un servicio de Rayos X / Imágenes.'
  },
  {
    slug: 'laboratorio',
    title: 'Laboratorio Clínico',
    icon: 'bi bi-microscope',
    category: 'Salud',
    intro: 'Exámenes precisos para un diagnóstico oportuno.',
    longDesc: 'Tiempos de entrega: Mismo día o 24-48h. Cotización según número de pruebas.',
    pruebas: [
      { cat: 'Hemograma', d: 'Biometría completa, frotis y recuentos.' },
      { cat: 'Bioquímica', d: 'Renal, Hepático, Electrolitos, Glicemia, Proteínas.' },
      { cat: 'Hormonales', d: 'T4 total/libre, TSH, Cortisol.' },
      { cat: 'Citologías', d: 'Muestras de masas, oídos y piel.' }
    ],
    instrucciones: [
      { m: 'Sangre', i: 'Ayuno 8–12 h (Solo agua). Evitar ejercicio 24h.' },
      { m: 'Orina', i: 'Muestra fresca (<2h) de la mañana. Frasco estéril.' },
      { m: 'Fecal', i: 'Reciente, de varios puntos. Sin arena ni contaminantes.' }
    ],
    waMsg: 'Hola Pet Station, cotizo exámenes de laboratorio.'
  }
];