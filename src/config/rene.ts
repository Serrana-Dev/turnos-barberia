// René Internacional, Villa Carlos Paz: salón de estética unisex con barbería, peluquería y uñas.
// Datos reales de su Instagram (@rene.internacional) y de su ficha de Google, noviembre 2026.
// Lo marcado como "muestra" (precios, equipo, productos) es de ejemplo: confirmarlo con el cliente.
import { type Foto, type Horario, type Negocio } from './tipos'

const f: Record<string, Foto> = {
  mohawk: { src: 'img/rene/mohawk.jpg', ancho: 900, alto: 1200, alt: 'Mohawk texturizado con mechas, de perfil, frente al espejo con luz dorada', titulo: 'Mohawk texturizado', autor: 'rene.internacional' },
  salon: { src: 'img/rene/salon.jpg', ancho: 540, alto: 960, alt: 'El salón: paredes azules, espejos con borde de luz y el techo de hexágonos', titulo: 'El salón', autor: 'rene.internacional' },
  asi: { src: 'img/rene/asi.jpg', ancho: 720, alto: 960, alt: 'Pelo largo rubio, lacio y brillante, de espaldas en el salón', titulo: 'Rubio y alisado', autor: 'rene.internacional' },
  fade: { src: 'img/rene/fade.jpg', ancho: 900, alto: 1200, alt: 'Fade bajo con textura arriba, de perfil', titulo: 'Fade con textura', autor: 'rene.internacional' },
  bu: { src: 'img/rene/bu.jpg', ancho: 720, alto: 960, alt: 'Corte con degradé y barba perfilada, de perfil', titulo: 'Degradé y barba', autor: 'rene.internacional' },
  taper: { src: 'img/rene/taper.jpg', ancho: 540, alto: 960, alt: 'Taper fade corto, de perfil', titulo: 'Taper fade', autor: 'rene.internacional' },
  espera: { src: 'img/rene/espera.jpg', ancho: 540, alto: 960, alt: 'Un barbero termina un corte a navaja bajo el techo de luz', titulo: 'Terminación a navaja', autor: 'rene.internacional' },
  viernes: { src: 'img/rene/viernes.jpg', ancho: 540, alto: 960, alt: 'Un viernes en el salón, con los sillones ocupados', titulo: 'Un viernes en René', autor: 'rene.internacional' },
  lunes: { src: 'img/rene/lunes.jpg', ancho: 540, alto: 960, alt: 'El salón recién ordenado, con el mostrador y su sello', titulo: 'El salón', autor: 'rene.internacional' },
}

// Ficha de Google: lunes a sábado de 9 a 13 y de 17 a 21, domingo cerrado
const partido: [string, string][] = [['09:00', '13:00'], ['17:00', '21:00']]
const horario: Horario = { 1: partido, 2: partido, 3: partido, 4: partido, 5: partido, 6: partido }

export const rene: Negocio = {
  id: 'rene',
  nombre: 'René Internacional',
  nombreCorto: 'René',
  rubro: 'Salón de estética',
  ciudad: 'Villa Carlos Paz',
  provincia: 'Córdoba',
  instagram: 'rene.internacional',
  dueño: 'René',
  inventado: false,
  bajada: 'Salón de estética unisex en Villa Carlos Paz: barbería, peluquería y uñas, en San Martín 931.',
  // El cobre del sello RI; los bloques oscuros van en el azul noche de las paredes del salón
  colores: { acento: '#a8623f', hover: '#924f2f', claro: '#f7ece4', tenue: '#e9c4a6', tinta: '#7a4128' },
  calificacion: { promedio: 4.7, reseñas: 27 },
  google: 'https://maps.google.com/?cid=15712413834289806733',

  // Opiniones reales de su ficha de Google. En la versión final se leen solas de Google.
  reseñas: [
    { nombre: 'Juan Nicolás E.', cuando: 'hace un mes', texto: 'Fui a cortarme el pelo y quedé muy contento con el resultado. Se tomaron el tiempo de escuchar lo que quería y el trato fue excelente.' },
    { nombre: 'Rodrigo G.', cuando: 'hace 3 semanas', texto: 'Muy buena atención y se nota que saben muchísimo.' },
    { nombre: 'Darío B.', cuando: 'hace 11 meses', texto: 'Excelente peluquería. Muy buen corte me hicieron. Esta gente sabe.' },
    { nombre: 'Cliente en Google', cuando: 'reseña destacada', texto: 'Muy buena atención personalizada.' },
    { nombre: 'Cliente en Google', cuando: 'reseña destacada', texto: 'Deliciosas personas.' },
  ],

  // Fotos de su Instagram
  fotos: {
    portada: [f.mohawk, f.asi, f.salon],
    trabajos: [f.fade, f.asi, f.mohawk, f.bu, f.taper, f.espera],
  },
  local: [
    {
      titulo: 'Con turno o por orden de llegada',
      texto: 'Reservá acá y te esperamos a la hora justa. Si pasás sin turno, te anotamos en la lista y te avisamos por WhatsApp cuando se libera un sillón.',
      foto: f.viernes,
    },
    {
      titulo: 'Promos de la semana',
      texto: 'Las promos cambian seguido y salen primero en el Instagram. Escribinos y te pasamos las de esta semana.',
      foto: f.lunes,
      acento: true,
      boton: 'Consultar promos por WhatsApp',
      whatsapp: 'Hola René! Quiero saber las promos de esta semana',
    },
  ],
  creditos: {
    texto: 'Fotos de Instagram',
    enlaces: [{ texto: '@rene.internacional', url: 'https://instagram.com/rene.internacional' }],
  },

  sucursales: [
    {
      id: 'san-martin',
      nombre: 'El salón',
      direccion: 'Av. San Martín 931, esq. José Muñoz',
      ciudad: 'Villa Carlos Paz',
      telefono: '3541 26-7571',
      mapa: 'https://maps.google.com/?q=René+Internacional,+Av.+San+Martín+931,+Villa+Carlos+Paz',
      horario,
    },
  ],

  grupos: [
    ['Barbería', 'Barbería'],
    ['Peluquería', 'Peluquería'],
    ['Uñas', 'Uñas'],
  ],
  persona: ['Profesional', 'Equipo'],
  estilo: true,

  // Los rubros salen de su Instagram (Masculino, Femenino, Uñas); los precios son de muestra.
  servicios: [
    { id: 'corte', nombre: 'Corte', descripcion: 'Fade, taper o tijera, con lavado y peinado.', grupo: 'Barbería', precio: 15000, duracion: 30, online: true, muestra: true, peso: 40 },
    { id: 'corte-barba', nombre: 'Corte y barba', descripcion: 'Corte completo y barba perfilada a navaja.', grupo: 'Barbería', precio: 20000, duracion: 45, online: true, muestra: true, peso: 18 },
    { id: 'barba', nombre: 'Barba', descripcion: 'Perfilado a navaja y toalla caliente.', grupo: 'Barbería', precio: 8000, duracion: 20, online: true, muestra: true, peso: 5 },
    { id: 'corte-nino', nombre: 'Corte niños', descripcion: 'Hasta 12 años.', grupo: 'Barbería', precio: 12000, duracion: 30, online: true, muestra: true, peso: 6 },
    { id: 'corte-dama', nombre: 'Corte y brushing', descripcion: 'Lavado, corte y secado con brushing.', grupo: 'Peluquería', precio: 22000, duracion: 60, online: true, muestra: true, peso: 8 },
    { id: 'brushing', nombre: 'Brushing', descripcion: 'Lavado y secado con forma.', grupo: 'Peluquería', precio: 13000, duracion: 30, online: true, muestra: true, peso: 4 },
    { id: 'raiz', nombre: 'Color de raíz', descripcion: 'Retoque de raíz con brushing.', grupo: 'Peluquería', precio: 38000, duracion: 90, online: true, muestra: true, peso: 4 },
    { id: 'mechas', nombre: 'Mechas o balayage', descripcion: 'Decoloración, matiz y brushing. Se reserva la tarde.', grupo: 'Peluquería', precio: 75000, duracion: 180, online: true, muestra: true, peso: 2 },
    { id: 'alisado', nombre: 'Alisado', descripcion: 'Alisado sin formol, con corte de puntas.', grupo: 'Peluquería', precio: 60000, duracion: 150, online: true, muestra: true, peso: 2 },
    { id: 'semi', nombre: 'Semipermanente', descripcion: 'Esmaltado semipermanente en manos.', grupo: 'Uñas', precio: 14000, duracion: 60, online: true, muestra: true, peso: 8 },
    { id: 'kapping', nombre: 'Kapping gel', descripcion: 'Refuerzo en gel sobre la uña natural, con color.', grupo: 'Uñas', precio: 19000, duracion: 90, online: true, muestra: true, peso: 4 },
    { id: 'esculpidas', nombre: 'Uñas esculpidas', descripcion: 'Extensión en acrílico o gel, con diseño.', grupo: 'Uñas', precio: 28000, duracion: 120, online: true, muestra: true, peso: 2 },
  ],

  // Equipo de muestra: hay que pedirle los nombres reales al local.
  equipo: [
    { id: 'rene', nombre: 'René', sucursal: 'san-martin', tono: 22, comision: 0, desde: '2009', rol: 'Barbería y peluquería', hace: ['Barbería', 'Peluquería'] },
    { id: 'lauti', nombre: 'Lauti', sucursal: 'san-martin', tono: 210, comision: 50, desde: '2023', franco: 1, rol: 'Barbería', hace: ['Barbería'] },
    { id: 'gonza', nombre: 'Gonza', sucursal: 'san-martin', tono: 150, comision: 50, desde: '2024', franco: 3, rol: 'Barbería', hace: ['Barbería'] },
    { id: 'mica', nombre: 'Mica', sucursal: 'san-martin', tono: 330, comision: 45, desde: '2022', franco: 2, rol: 'Color y peluquería', hace: ['Peluquería'] },
    { id: 'flor', nombre: 'Flor', sucursal: 'san-martin', tono: 280, comision: 45, desde: '2025', franco: 4, rol: 'Uñas', hace: ['Uñas'] },
  ],

  productos: [
    { id: 'pomada', nombre: 'Pomada mate', precio: 11000, stock: 12, muestra: true },
    { id: 'polvo', nombre: 'Polvo texturizador', precio: 9500, stock: 7, muestra: true },
    { id: 'shampoo', nombre: 'Shampoo matizador', precio: 14000, stock: 5, muestra: true },
    { id: 'aceite', nombre: 'Aceite de cutículas', precio: 6000, stock: 3, muestra: true },
  ],
}
