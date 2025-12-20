export const services = [
  {
    slug: 'peluqueria',
    title: 'Peluquería & Spa',
    icon: 'bi bi-scissors',
    forPets: ['perro', 'gato'],
    desc: 'Estética profesional con productos Hydra y manejo de bajo estrés.',
    longDesc: 'Nuestro servicio de estética se enfoca en el bienestar integral. Incluye baño, secado, limpieza de oídos, corte de uñas y limpieza dental superficial. Glándulas perianales según evaluación clínica.',
    features: [
      'Shampoo Premium Hydra o medicado',
      'Manejo amigable (Low Stress)',
      'Limpieza de oídos y corte de uñas',
      'Limpieza dental superficial'
    ],
    // Información exacta de peluqueria.js
    pricing: {
      dogs: [
        { title: 'X-SMALL (Hasta 4 kg)', weight: 'Chihuahua, Yorkie', prices: [{n:'Solo baño', p:127900},{n:'Baño y corte', p:128400}] },
        { title: 'SMALL (4.1 – 10 kg)', weight: 'French Bulldog, Poodle', prices: [{n:'Solo baño', p:135400},{n:'Baño y corte', p:142500}] },
        { title: 'MEDIUM (10.1 – 25 kg)', weight: 'Cocker, Beagle, Border Collie', prices: [{n:'Solo baño', p:171900},{n:'Baño y corte', p:178200}] },
        { title: 'LARGE (25 – 45 kg)', weight: 'Husky, Golden, Pastor Alemán', prices: [{n:'Solo baño', p:185200},{n:'Baño y corte', p:199700}] },
        { title: 'X-LARGE (45+ kg)', weight: 'Gran Danés, San Bernardo', prices: [{n:'Solo baño', p:200900},{n:'Baño y corte', p:206700}] }
      ],
      cats: [
        { title: 'Pelo largo', prices: [{n:'Solo baño', p:127900}] },
        { title: 'Pelo corto', prices: [{n:'Solo baño', p:127900}] }
      ]
    },
    ctaType: 'calendly', // Para disparar reserva-modal.js
    waMsg: 'Hola, quiero cotizar peluquería.'
  },
  {
    slug: 'consulta',
    title: 'Consulta Médica',
    icon: 'bi bi-heart-pulse',
    forPets: ['perro', 'gato'],
    desc: 'Valoración médica profesional para el bienestar de tu mascota.',
    longDesc: 'Evaluamos el estado general de salud de tu mascota, identificando síntomas de alerta y estableciendo planes de tratamiento o prevención.',
    features: [
      'Examen físico completo',
      'Triaje de síntomas: Vómito, Diarrea, Tos, Picazón',
      'Medicina preventiva y plan vacunal'
    ],
    waMsg: 'Hola, necesito consulta para mi mascota. Síntomas: '
  },
  {
    slug: 'viajes',
    title: 'Trámites de Viaje',
    icon: 'bi bi-airplane',
    forPets: ['perro', 'gato'],
    desc: 'Certificados ICA y trámites internacionales (USA, Europa, Brasil).',
    longDesc: 'Gestionamos Certificado ICA (CIS), Microchip ISO Universal y pruebas de serología para que tu mascota viaje sin problemas.',
    features: [
      'Certificado de salud ICA (CIS)',
      'Microchip ISO Universal',
      'Serología de Rabia para Europa',
      'Asesoría por destino (USA, EU, BR)'
    ],
    waMsg: 'Hola, quiero empezar los trámites de viaje para mi mascota.'
  },
  {
    slug: 'cirugias',
    title: 'Cirugías',
    icon: 'bi bi-hospital',
    forPets: ['perro', 'gato'],
    desc: 'Procedimientos quirúrgicos con monitoreo avanzado.',
    longDesc: 'Contamos con quirófano equipado y especialistas en tejidos blandos y esterilizaciones.',
    features: ['Esterilización', 'Cirugía de tejidos blandos', 'Monitoreo anestésico'],
    waMsg: 'Hola, quiero información sobre cirugías para mi mascota.'
  },
  {
    slug: 'laboratorio',
    title: 'Laboratorio Clínico',
    icon: 'bi bi-microscope',
    forPets: ['perro', 'gato'],
    desc: 'Exámenes diagnósticos rápidos y precisos.',
    longDesc: 'Realizamos hemogramas, bioquímicas y pruebas diagnósticas integrales.',
    features: ['Hemogramas', 'Bioquímicas sanguíneas', 'Pruebas diagnósticas'],
    waMsg: 'Hola, quisiera información sobre exámenes de laboratorio.'
  },
  {
    slug: 'guarderia',
    title: 'Guardería',
    icon: 'bi bi-tree',
    forPets: ['perro'],
    desc: 'Espacio de socialización y recreación campestre.',
    longDesc: 'Servicio de guardería para caninos con amplias zonas verdes en Chía.',
    features: ['Zonas verdes', 'Socialización supervisada', 'Sede Chía'],
    waMsg: 'Hola, quisiera información de guardería.'
  }
];