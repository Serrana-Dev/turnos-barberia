// La forma de los datos de un negocio. Cada demo es un archivo con estos datos (ayrton.ts, filo.ts).

export type SucursalId = string

/** Franjas horarias por día de la semana (0 = domingo). */
export type Horario = Record<number, [string, string][]>

export type Sucursal = {
  id: SucursalId
  nombre: string
  direccion: string
  ciudad: string
  telefono: string
  mapa: string
  horario: Horario
}

export type Servicio = {
  id: string
  nombre: string
  descripcion: string
  /** Uno de los grupos de negocio.grupos (Corte, Barba, Color… o Barbería, Peluquería, Uñas). */
  grupo: string
  precio: number
  duracion: number // minutos
  online: boolean
  muestra?: boolean
  /** Cuánto se pide, para armar los turnos de la demo (por defecto 5). */
  peso?: number
  /** Precio distinto según el día (0 = domingo), como "martes a $10.000". El precio de arriba es el más bajo. */
  precioPorDia?: Record<number, number>
}

export type Barbero = {
  id: string
  nombre: string
  sucursal: SucursalId
  /** Tono propio (0-360) para identificarlo en agenda y reportes. */
  tono: number
  comision: number // porcentaje
  desde: string
  /** Día de franco (0 = domingo), si tiene. */
  franco?: number
  instagram?: string
  /** Qué hace, si no hace de todo: "Barbería y peluquería", "Uñas". */
  rol?: string
  /** Los grupos de servicios que atiende. Sin esto, todos. */
  hace?: string[]
}

export type Producto = {
  id: string
  nombre: string
  precio: number
  stock: number
  muestra?: boolean
}

export type Foto = { src: string; ancho: number; alto: number; alt: string; titulo?: string; autor: string }

export type Negocio = {
  /** Identifica la demo: separa los datos guardados en el navegador y elige logo. */
  id: string
  nombre: string
  nombreCorto: string
  rubro: string
  ciudad: string
  provincia: string
  instagram: string
  dueño: string
  /** Si el negocio es inventado para mostrar el sistema a otros. */
  inventado: boolean
  /** La frase de la portada. */
  bajada: string
  colores: {
    acento: string
    hover: string
    /** Fondo claro del acento, para chips y hover. */
    claro: string
    /** Texto claro sobre el acento o sobre negro. */
    tenue: string
    /** El acento oscuro, para texto sobre el fondo claro. */
    tinta: string
  }
  calificacion: { promedio: number; reseñas: number }
  google?: string
  reseñas: { nombre: string; cuando: string; texto: string }[]
  fotos: { portada: Foto[]; trabajos: Foto[] }
  /** Bloques con foto grande de "En el local". */
  local: { titulo: string; texto: string; foto: Foto; whatsapp?: string; boton?: string; acento?: boolean }[]
  creditos: { texto: string; enlaces: { texto: string; url: string }[] }
  sucursales: Sucursal[]
  servicios: Servicio[]
  equipo: Barbero[]
  productos: Producto[]
  /** Los grupos de la lista de precios, en orden: [grupo, título]. */
  grupos?: [string, string][]
  /** La foto de cada rubro para elegirlo (como las historias destacadas): { Uñas: 'img/…' }. */
  fotosGrupo?: Record<string, string>
  /** Cómo se llama a quien atiende: [singular, plural]. Por defecto Barbero, Barberos. */
  persona?: [string, string]
  /** Rubros que todavía no se pueden reservar ("Uñas, próximamente"). */
  proximamente?: string[]
  /** Una estética propia: se aplica con [data-negocio] en el CSS. */
  estilo?: boolean
  /** Qué tan lleno está el local en la demo (1 = como una barbería grande; 0,6 = un salón chico). */
  ocupacion?: number
}

export const gruposDe = (n: Negocio): [string, string][] =>
  n.grupos ?? [
    ['Corte', 'Cortes'],
    ['Barba', 'Barba'],
    ['Color', 'Color y mechas'],
  ]

export const personaDe = (n: Negocio) => n.persona ?? ['Barbero', 'Barberos']

/** Si esta persona del equipo hace este servicio. */
export const puedeHacer = (b: { hace?: string[] }, s: { grupo: string } | undefined) => !s || !b.hace || b.hace.includes(s.grupo)

export const lunesASabado = (franjas: [string, string][]): Horario => ({
  1: franjas, 2: franjas, 3: franjas, 4: franjas, 5: franjas, 6: franjas,
})

/** El precio del servicio ese día (fecha "2026-11-04"); sin día, el más bajo. */
export function precioDe(s: { precio: number; precioPorDia?: Record<number, number> }, dia?: string) {
  if (!dia || !s.precioPorDia) return s.precio
  const dow = new Date(`${dia}T12:00:00`).getDay()
  return s.precioPorDia[dow] ?? s.precio
}

/** El precio más bajo para mostrar como "desde". Si hay precios confirmados, no usa los de muestra. */
export function precioDesde(servicios: { precio: number; muestra?: boolean }[]) {
  const conPrecio = servicios.filter((s) => s.precio > 0)
  const confirmados = conPrecio.filter((s) => !s.muestra)
  const lista = confirmados.length ? confirmados : conPrecio
  return Math.min(...lista.map((s) => s.precio), Infinity)
}

/** Los tramos de precio por día, cortos: [{ dias: 'Mar', precio }, { dias: 'Mié y Jue', precio }, …]. */
export function preciosPorDia(s: { precioPorDia?: Record<number, number> }) {
  const pd = s.precioPorDia
  if (!pd) return []
  const cortos = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const dias = Object.keys(pd).map(Number).sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
  const tramos: { dias: number[]; precio: number }[] = []
  for (const d of dias) {
    const ultimo = tramos[tramos.length - 1]
    if (ultimo && ultimo.precio === pd[d]) ultimo.dias.push(d)
    else tramos.push({ dias: [d], precio: pd[d] })
  }
  return tramos.map((t) => ({
    dias: t.dias.length === 1 ? cortos[t.dias[0]] : t.dias.length === 2 ? `${cortos[t.dias[0]]} y ${cortos[t.dias[1]]}` : `${cortos[t.dias[0]]} a ${cortos[t.dias[t.dias.length - 1]]}`,
    precio: t.precio,
  }))
}
