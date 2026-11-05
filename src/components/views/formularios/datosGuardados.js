// Solo datos de la persona y la mascota. Las preguntas de salud y comportamiento se responden en cada visita.
export function aplicarDatosGuardados(form, { telefono, correoVerificado, perfil, mascota }) {
  form.telefono = telefono
  if (perfil) {
    form.nombreCliente = perfil.nombreCliente || ''
    form.email = perfil.email || ''
    form.direccion = perfil.direccion || ''
  }
  if (correoVerificado) form.email = correoVerificado
  if (mascota) {
    for (const campo of ['nombreMascota', 'especie', 'raza', 'color', 'edad', 'sexo']) {
      form[campo] = mascota[campo] || ''
    }
  }
}
