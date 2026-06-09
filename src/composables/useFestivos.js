/**
 * Festivos de Colombia calculados en el front (Ley Emiliani + Pascua).
 * Mismo cálculo que el back (FestivosColombia.java) para feedback instantáneo.
 */

// Domingo de Pascua (algoritmo de Computus / Meeus)
function calcularPascua(y) {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const g = Math.floor((8 * b + 13) / 25);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (2 * e + 2 * i - h - k + 32) % 7;
  const m = Math.floor((a + 11 * h + 19 * l) / 433);
  const mes = Math.floor((h + l - 7 * m + 90) / 25);
  const dia = (h + l - 7 * m + 33 * mes + 19) % 32;
  return new Date(y, mes - 1, dia);
}

// Mueve la fecha al lunes siguiente si no cae lunes (Ley Emiliani)
function siguienteLunes(fecha) {
  const dow = fecha.getDay(); // 0=dom ... 1=lun
  if (dow === 1) return fecha;
  const diff = dow === 0 ? 1 : 8 - dow;
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + diff);
}

const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const cache = {};

function festivosDelAnio(anio) {
  if (cache[anio]) return cache[anio];
  const set = new Set();
  const add = (d) => set.add(fmt(d));
  const fijo = (m, day) => add(new Date(anio, m - 1, day));
  const emiliani = (m, day) => add(siguienteLunes(new Date(anio, m - 1, day)));

  // Fijos
  fijo(1, 1); fijo(5, 1); fijo(7, 20); fijo(8, 7); fijo(12, 8); fijo(12, 25);
  // Emiliani (al lunes)
  emiliani(1, 6); emiliani(3, 19); emiliani(6, 29); emiliani(8, 15);
  emiliani(10, 12); emiliani(11, 1); emiliani(11, 11);
  // Basados en Pascua
  const p = calcularPascua(anio);
  const masDias = (n) => new Date(p.getFullYear(), p.getMonth(), p.getDate() + n);
  add(masDias(-3));                    // Jueves Santo
  add(masDias(-2));                    // Viernes Santo
  add(siguienteLunes(masDias(43)));    // Ascensión
  add(siguienteLunes(masDias(64)));    // Corpus Christi
  add(siguienteLunes(masDias(71)));    // Sagrado Corazón

  cache[anio] = set;
  return set;
}

export function useFestivos() {
  /** Recibe 'YYYY-MM-DD' o Date. Devuelve true si es festivo colombiano */
  const esFestivo = (fecha) => {
    const d = typeof fecha === 'string' ? new Date(`${fecha}T12:00:00`) : fecha;
    return festivosDelAnio(d.getFullYear()).has(fmt(d));
  };

  /** true si es domingo */
  const esDomingo = (fecha) => {
    const d = typeof fecha === 'string' ? new Date(`${fecha}T12:00:00`) : fecha;
    return d.getDay() === 0;
  };

  /** true si NO hay atención (domingo o festivo) */
  const noHayAtencion = (fecha) => esDomingo(fecha) || esFestivo(fecha);

  return { esFestivo, esDomingo, noHayAtencion };
}
