import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, ChevronRight } from 'lucide-react'
import { negocio } from '../config/negocio'
import { Logo } from '../lib/ui'
import { Persona } from './comun'
import { entrar, type Sesion } from './sesion'

/**
 * La entrada de la demo: se elige cómo verla. El cliente va a la página de turnos;
 * el dueño entra al panel completo y el staff a su día, sin caja ni reportes.
 * En el sistema real cada uno entra con su usuario y no se elige.
 */
export default function Ingreso({ alEntrar }: { alEntrar: (s: Sesion) => void }) {
  useEffect(() => {
    document.title = `Entrar · ${negocio.nombre}`
  }, [])

  return (
    <div className="ingreso">
      <div className="ingreso-caja">
        <Logo tamaño={56} />
        <h1>{negocio.nombre}</h1>
        <p className="ingreso-bajada">¿Cómo querés entrar a la demo?</p>
        <ul className="ingreso-personas">
          <li>
            <Link to="/" className="ingreso-opcion">
              <span className="ingreso-icono" aria-hidden="true"><CalendarCheck size={20} /></span>
              <span>
                <strong>Cliente</strong>
                <small>Saca turno en la página. No ve el panel.</small>
              </span>
              <ChevronRight size={18} className="ingreso-flecha" aria-hidden="true" />
            </Link>
          </li>
          {negocio.accesos!.map((a) => {
            const b = negocio.equipo.find((x) => x.id === a.quien)!
            const dueño = a.rol === 'dueño'
            return (
              <li key={a.quien}>
                <button className="ingreso-opcion" onClick={() => { const s = entrar(a.quien); if (s) alEntrar(s) }}>
                  <Persona b={b} />
                  <span>
                    <strong>{dueño ? `Dueño · ${b.nombre}` : `Staff · ${b.nombre}`}</strong>
                    <small>{dueño ? 'Todo: caja, reportes, precios y equipo.' : 'Su día y la agenda. Sin caja ni reportes.'}</small>
                  </span>
                  <ChevronRight size={18} className="ingreso-flecha" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
        <p className="ingreso-nota">Es una demo: las reservas y la plata son de prueba. En el sistema real cada uno entra con su usuario.</p>
      </div>
    </div>
  )
}
