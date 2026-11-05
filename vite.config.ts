import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lo que va en el <head> de cada negocio (el resto sale de src/config).
type Cabeza = { titulo: string; descripcion: string; icono: string; color?: string; extra?: string }
const cabeza: Record<string, Cabeza> = {
  filo: {
    titulo: 'Barbería Filo, turnos online en Córdoba',
    descripcion: 'Sacá turno online en Barbería Filo, Centro o Güemes. Demo de Filo, turnos online para barberías.',
    icono: 'favicon-filo.svg',
  },
  ayrton: {
    titulo: 'Ayrton Estilistas, barbería en Villa Carlos Paz',
    descripcion: 'Ayrton Estilistas, barbería en Villa Carlos Paz. Sacá turno online en Centro Nuevo o Centro Viejo.',
    icono: 'favicon.svg',
  },
  rene: {
    titulo: 'René Internacional, salón de estética en Villa Carlos Paz',
    descripcion: 'René Internacional: barbería, peluquería y uñas en Av. San Martín 931, Villa Carlos Paz. Sacá turno online.',
    icono: 'favicon-rene.png',
    color: '#0d1a3a',
    // La letra de los títulos: una romana clásica, como la guarda griega y la columna del sello
    extra:
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet" />',
  },
}

// base relativa: el mismo build sirve en GitHub Pages bajo /<repo>/ o en cualquier carpeta.
// "npm run build" arma la barbería inventada en dist/, Ayrton en dist/ayrton/ y René en dist/rene/.
export default defineConfig(({ mode }) => {
  const c = cabeza[mode] ?? cabeza.filo
  return {
    base: './',
    plugins: [
      react(),
      {
        name: 'cabeza-del-negocio',
        transformIndexHtml: (html: string) =>
          html
            .replace('%TITULO%', c.titulo)
            .replace('%DESCRIPCION%', c.descripcion)
            .replace('%ICONO%', c.icono)
            .replace('#0c0c0f', c.color ?? '#0c0c0f')
            .replace('image/svg+xml', c.icono.endsWith('.png') ? 'image/png' : 'image/svg+xml')
            .replace('</head>', `${c.extra ?? ''}</head>`),
      },
    ],
  }
})
