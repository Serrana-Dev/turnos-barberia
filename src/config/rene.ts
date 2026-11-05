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
  dueño: 'Charly',
  inventado: false,
  bajada: 'Salón de estética unisex en Villa Carlos Paz: barbería y peluquería, y muy pronto uñas. En Av. San Martín 931.',
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
  ],

  // Fotos de su Instagram
  fotos: {
    portada: [f.mohawk, f.asi, f.salon],
    trabajos: [f.fade, f.asi, f.mohawk, f.bu, f.taper, f.espera],
  },
  local: [
    {
      titulo: 'Con turno o por orden de llegada',
      texto: 'Reservá acá y te esperamos a la hora justa. Si pasás sin turno, te anotamos en la lista de espera del salón y te decimos cuánto falta.',
      foto: f.viernes,
    },
    {
      titulo: 'Los martes, corte a $10.000',
      texto: 'El corte masculino cambia según el día: martes $10.000, miércoles y jueves $12.000, viernes y sábado $14.000.',
      foto: f.lunes,
      acento: true,
      boton: 'Pedir turno para el martes',
      whatsapp: 'Hola! Quiero un turno para corte el martes',
    },
  ],
  creditos: {
    texto: 'Fotos de Instagram',
    enlaces: [
      { texto: '@rene.internacional', url: 'https://instagram.com/rene.internacional' },
      { texto: 'uñas: rawpixel (CC0)', url: 'https://www.rawpixel.com/image/3299322/free-photo-image-nail-polish-manicure' },
    ],
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
  proximamente: ['Uñas'],
  // La foto de cada rubro, como las historias destacadas de su Instagram (la de uñas es de rawpixel, CC0)
  fotosGrupo: { Barbería: 'img/rene/fade.jpg', Peluquería: 'img/rene/asi.jpg', Uñas: 'img/rene/unas.jpg' },
  estilo: true,
  // Un salón chico (27 opiniones en Google): la demo no lo muestra lleno como a una barbería grande
  ocupacion: 0.6,

  // Del catálogo de WhatsApp de René (noviembre 2026): los servicios, el precio del corte masculino según el día
  // y uñas como "próximamente". Los demás precios no están publicados: son de muestra.
  servicios: [
    { id: 'corte', nombre: 'Corte masculino', descripcion: 'Corte y estilo, con lavado.', grupo: 'Barbería', precio: 10000, precioPorDia: { 2: 10000, 3: 12000, 4: 12000, 5: 14000, 6: 14000 }, duracion: 30, online: true, peso: 40 },
    { id: 'barba', nombre: 'Arreglo de barba', descripcion: 'Perfilado y prolijado.', grupo: 'Barbería', precio: 7000, duracion: 30, online: true, muestra: true, peso: 8 },
    { id: 'afeitado', nombre: 'Ritual de afeitado', descripcion: 'Toalla caliente, navaja y bálsamo.', grupo: 'Barbería', precio: 9000, duracion: 30, online: true, muestra: true, peso: 4 },
    { id: 'corte-dama', nombre: 'Corte de dama', descripcion: 'Asesoramiento, lavado y peinado.', grupo: 'Peluquería', precio: 16000, duracion: 60, online: true, muestra: true, peso: 12 },
    { id: 'color', nombre: 'Color', descripcion: 'Tinte de raíz o completo, con matiz.', grupo: 'Peluquería', precio: 32000, duracion: 120, online: true, muestra: true, peso: 5 },
    { id: 'mechas', nombre: 'Mechas', descripcion: 'Balayage, babylights o highlights.', grupo: 'Peluquería', precio: 60000, duracion: 180, online: true, muestra: true, peso: 2 },
    { id: 'tratamiento', nombre: 'Tratamientos', descripcion: 'Hidratación, keratina, reconstrucción o brillo.', grupo: 'Peluquería', precio: 35000, duracion: 90, online: true, muestra: true, peso: 3 },
    { id: 'manos', nombre: 'Manicura', descripcion: 'Tradicional o semipermanente.', grupo: 'Uñas', precio: 0, duracion: 60, online: false },
    { id: 'esculpidas', nombre: 'Esculpidas', descripcion: 'En gel o acrílico, con nail art.', grupo: 'Uñas', precio: 0, duracion: 120, online: false },
    { id: 'pies', nombre: 'Belleza de pies', descripcion: 'Pedicura completa.', grupo: 'Uñas', precio: 0, duracion: 60, online: false },
  ],

  // Equipo de muestra: Charly (el dueño) en barbería (de martes a sábado, como los precios del corte) y Mica en peluquería.
  equipo: [
    { id: 'rene', nombre: 'Charly', sucursal: 'san-martin', tono: 22, comision: 0, desde: '2009', franco: 1, rol: 'Barbería', hace: ['Barbería'] },
    { id: 'mica', nombre: 'Mica', sucursal: 'san-martin', tono: 330, comision: 45, desde: '2022', rol: 'Peluquería, color y tratamientos', hace: ['Peluquería'] },
  ],

  productos: [
    { id: 'pomada', nombre: 'Pomada mate', precio: 11000, stock: 12, muestra: true },
    { id: 'shampoo', nombre: 'Shampoo matizador', precio: 14000, stock: 5, muestra: true },
    { id: 'aceite', nombre: 'Aceite de cutículas', precio: 6000, stock: 3, muestra: true },
  ],

  // La demo deja entrar como cliente, como dueño (Charly: caja y reportes) o como staff (Mica: su día y la agenda).
  accesos: [
    { quien: 'rene', rol: 'dueño' },
    { quien: 'mica', rol: 'empleado' },
  ],
}
