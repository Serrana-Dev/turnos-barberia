// Los rubros del salón (Barbería, Peluquería, Uñas) como las historias destacadas de Instagram:
// un círculo con foto por rubro, el elegido con el aro de color. Se usa en Precios y al sacar turno.
import { negocio, precioDesde } from '../config/negocio'
import { pesos } from '../lib/formato'

export type Rubro = { id: string; titulo: string; desde: number; cuantos: number }

export function Rubros({
  rubros,
  activo,
  elegir,
  className = '',
}: {
  rubros: Rubro[]
  activo: string
  elegir: (id: string) => void
  className?: string
}) {
  return (
    <div className={`rubros-historias ${className}`} role="tablist" aria-label="Rubro">
      {rubros.map((r) => {
        const foto = negocio.fotosGrupo?.[r.id]
        const elegido = r.id === activo
        return (
          <button
            key={r.id}
            role="tab"
            aria-selected={elegido}
            className={`rubro ${elegido ? 'activo' : ''}`}
            onClick={() => elegir(r.id)}
            aria-label={negocio.proximamente?.includes(r.id) ? `${r.titulo}: próximamente` : `${r.titulo}: ${r.cuantos} servicios desde ${pesos(r.desde)}`}
          >
            <span className="rubro-aro" aria-hidden="true">
              {foto ? <img src={foto} alt="" width={160} height={160} /> : <span className="rubro-letra">{r.titulo[0]}</span>}
            </span>
            <span className="rubro-titulo">{r.titulo}</span>
            <span className="rubro-desde">{negocio.proximamente?.includes(r.id) ? 'Próximamente' : `desde ${pesos(r.desde)}`}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Los rubros con servicios, con su precio más bajo, a partir de la lista. */
export function armarRubros(grupos: [string, string][], servicios: { grupo: string; precio: number; online?: boolean; muestra?: boolean }[]): Rubro[] {
  return grupos
    .map(([id, titulo]) => {
      const lista = servicios.filter((s) => s.grupo === id)
      return { id, titulo, cuantos: lista.length, desde: precioDesde(lista) }
    })
    .filter((r) => r.cuantos > 0)
}
