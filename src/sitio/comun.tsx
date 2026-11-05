import { Link } from 'react-router-dom'
import { negocio } from '../config/negocio'

// El producto que se vende en general. Las demos de clientes (Ayrton, René) son propuestas a medida y no llevan esta marca.
export const PRODUCTO = 'Filo'

/** Franja de la demo: explica qué es y lleva al panel. No es parte del diseño del cliente. */
export function BarraDemo({ a = '/admin', texto = 'Ver el panel del negocio' }: { a?: string; texto?: string }) {
  return (
    <div className="barra-demo">
      <p>
        Demo
        <span className="demo-detalle">
          {negocio.inventado
            ? ` de ${PRODUCTO}, turnos online para barberías. El local y las reservas son de ejemplo.`
            : ` para ${negocio.nombre}. Las reservas son de prueba.`}
        </span>
      </p>
      <Link to={a}>{texto}</Link>
    </div>
  )
}

export function Creditos() {
  const { texto, enlaces } = negocio.creditos
  return (
    <p className="creditos">
      {texto}:{' '}
      {enlaces.map((a, i) => (
        <span key={a.url}>
          <a href={a.url} target="_blank" rel="noreferrer">
            {a.texto}
          </a>
          {i < enlaces.length - 1 ? ', ' : '.'}
        </span>
      ))}{' '}
      {negocio.inventado ? 'Nombres, datos y reseñas de ejemplo.' : 'Reseñas de Google.'}
    </p>
  )
}
