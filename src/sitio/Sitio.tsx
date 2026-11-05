import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { gruposDe, negocio, precioDe, precioDesde, preciosPorDia, puedeHacer, type SucursalId } from '../config/negocio'
import { aMin, ahoraMin, capital, duracion, fechaRelativa, hora, hoyClave, pesos, sumarDias } from '../lib/formato'
import { franjas, huecos, proximoLibre, useDemo } from '../lib/store'
import { Logo } from '../lib/ui'
import { BarraDemo, Creditos } from './comun'
import { armarRubros, Rubros } from './Rubros'

const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const whatsapp = (tel: string, texto?: string) =>
  `https://wa.me/54${tel.replace(/\D/g, '')}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`

/** Resume el horario semanal en filas como "Lunes a sábado: 10:00 a 20:30". */
function filasHorario(id: SucursalId) {
  const s = negocio.sucursales.find((x) => x.id === id)!
  const texto = (d: number) => s.horario[d]?.map(([a, b]) => `${a} a ${b}`).join(' y ') ?? 'Cerrado'
  const filas: { dias: string; horas: string }[] = []
  let inicio = 1
  for (let d = 1; d <= 7; d++) {
    const actual = texto(d % 7)
    const siguiente = d < 7 ? texto((d + 1) % 7) : null
    if (actual !== siguiente) {
      const desde = dias[inicio % 7]
      const hasta = dias[d % 7].toLowerCase()
      filas.push({ dias: inicio === d ? desde : `${desde} a ${hasta}`, horas: actual })
      inicio = d + 1
    }
  }
  return filas
}

/** "Abierto, cierra a las 20:30" o "Cerrado, abre a las 16:30" para hoy. */
function estadoAhora(id: SucursalId) {
  const ahora = ahoraMin()
  const fr = franjas(id, hoyClave()).map(([a, b]) => [aMin(a), aMin(b)])
  const abierta = fr.find(([a, b]) => ahora >= a && ahora < b)
  if (abierta) return { abierto: true, texto: `Abierto, cierra a las ${hora(abierta[1])}` }
  const luego = fr.find(([a]) => a > ahora)
  if (luego) return { abierto: false, texto: `Cerrado, abre a las ${hora(luego[0])}` }
  return { abierto: false, texto: 'Cerrado por hoy' }
}

function Estrellas({ tamaño = 16 }: { tamaño?: number }) {
  return (
    <span className="estrellas" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={tamaño} strokeWidth={0} fill="currentColor" />
      ))}
    </span>
  )
}

function Cabecera() {
  return (
    <header className="cabecera">
      <Link to="/" className="marca" aria-label={`${negocio.nombre}, inicio`}>
        <Logo tamaño={32} />
        <span>{negocio.nombre}</span>
      </Link>
      <nav className="cabecera-menu en-escritorio" aria-label="Secciones">
        {secciones.map(([id, t]) => (
          <a key={id} href={`#${id}`}>
            {t}
          </a>
        ))}
      </nav>
      <Link to="/reservar" className="btn btn-primario btn-chico">
        Sacar turno
      </Link>
    </header>
  )
}

/** Arriba de todo: quiénes son, cómo los califican y el próximo turno libre. */
function Portada() {
  const ahora = estadoAhora(negocio.sucursales[0].id)
  const fotos = useRef<HTMLDivElement>(null)
  const [foto, setFoto] = useState(0)
  return (
    <header className="portada">
      <div
        className="portada-fotos"
        ref={fotos}
        onScroll={(ev) => setFoto(Math.round(ev.currentTarget.scrollLeft / ev.currentTarget.clientWidth))}
      >
        {negocio.fotos.portada.map((f, i) => (
          <img key={f.src} src={f.src} alt={f.alt} width={f.ancho} height={f.alto} fetchPriority={i === 0 ? 'high' : 'auto'} />
        ))}
      </div>
      {/* En el celular el nombre va arriba de la foto, como en una app; las fotos se deslizan por detrás */}
      <span className="portada-sombra" aria-hidden="true" />
      <div className="portada-puntos" aria-hidden="true">
        {negocio.fotos.portada.map((f, i) => (
          <i key={f.src} className={i === foto ? 'activo' : ''} />
        ))}
      </div>
      <div className="portada-texto">
        <a href="#resenas" className="portada-nota">
          <Estrellas tamaño={15} />
          <strong>{negocio.calificacion.promedio.toLocaleString('es-AR')}</strong>
          <span>{negocio.calificacion.reseñas} reseñas en Google</span>
        </a>
        <h1>{negocio.nombre}</h1>
        <p className="portada-bajada">{negocio.bajada}</p>
        <p className={`portada-estado ${ahora.abierto ? 'abierto' : ''}`}>
          <span className="punto" aria-hidden="true" />
          {negocio.sucursales[0].nombre}: {ahora.texto.toLowerCase()}
        </p>
        <ProximoLibre />
      </div>
    </header>
  )
}

/** El turno más cercano que está libre, por sucursal. Es lo primero que se puede reservar. */
function ProximoLibre() {
  const e = useDemo()
  const id = useId()
  const [suc, setSuc] = useState<SucursalId>(negocio.sucursales[0].id)
  const libre = useMemo(() => proximoLibre(e, suc), [e, suc])
  const barbero = libre && e.equipo.find((b) => b.id === libre.barberoId)
  const corte = e.servicios.find((s) => s.id === 'corte')!
  const destino = libre
    ? `/reservar?suc=${suc}&servicio=corte&dia=${libre.dia}&hora=${libre.inicio}&barbero=${libre.barberoId}`
    : `/reservar?suc=${suc}`

  return (
    <aside className="libre" aria-labelledby={id} aria-live="polite">
      <div className="libre-arriba">
        <h2 id={id}>Próximo turno libre</h2>
        {negocio.sucursales.length > 1 && (
        <div className="segmento" role="tablist" aria-label="Sucursal">
          {negocio.sucursales.map((s) => (
            <button key={s.id} role="tab" aria-selected={suc === s.id} className={suc === s.id ? 'activo' : ''} onClick={() => setSuc(s.id)}>
              {s.nombre}
            </button>
          ))}
        </div>
        )}
      </div>
      {libre && barbero ? (
        <p className="libre-hora">
          <strong>
            {capital(fechaRelativa(libre.dia))}, {hora(libre.inicio)}
          </strong>
          <span>
            Corte con {barbero.nombre}, {pesos(precioDe(corte, libre.dia))}
          </span>
        </p>
      ) : (
        <p className="libre-hora">
          <span>Esta semana está completa. Escribinos y te avisamos si se libera un lugar.</span>
        </p>
      )}
      <div className="libre-acciones">
        <Link className="btn btn-blanco" to={destino}>
          {libre ? `Reservar ${hora(libre.inicio)}` : 'Ver horarios'}
        </Link>
        <Link className="btn btn-borde" to={`/reservar?suc=${suc}`}>
          Otro día
        </Link>
      </div>
    </aside>
  )
}

const secciones = [
  ['servicios', 'Precios'],
  ['trabajos', 'Trabajos'],
  ['equipo', 'Equipo'],
  ['resenas', 'Reseñas'],
  ['sucursales', negocio.sucursales.length > 1 ? 'Sucursales' : 'Dónde estamos'],
]

/** La lista de precios como la pizarra del local. */
function Servicios() {
  const e = useDemo()
  const grupos = gruposDe(negocio).filter(([g]) => e.servicios.some((s) => s.grupo === g))
  // Un salón con rubros (barbería, peluquería, uñas): en el celular se elige el rubro arriba y la lista se desliza
  const conRubros = !!negocio.grupos && grupos.length > 1
  const rubros = armarRubros(grupos, e.servicios)
  const [rubro, setRubro] = useState(grupos[0]?.[0])
  const pizarra = useRef<HTMLDivElement>(null)
  const indice = Math.max(0, grupos.findIndex(([g]) => g === rubro))

  // El alto de la lista sigue al rubro que se ve, para que no quede un hueco abajo
  useEffect(() => {
    const el = pizarra.current
    if (!el || !conRubros) return
    const ajustar = () => {
      const panel = el.children[indice] as HTMLElement | undefined
      el.style.height = panel && matchMedia('(max-width: 900px)').matches ? `${panel.offsetHeight}px` : ''
    }
    ajustar()
    window.addEventListener('resize', ajustar)
    return () => window.removeEventListener('resize', ajustar)
  }, [indice, conRubros, e.servicios])

  const irA = (id: string) => {
    const el = pizarra.current
    const i = grupos.findIndex(([g]) => g === id)
    setRubro(id)
    const panel = el?.children[i] as HTMLElement | undefined
    if (el && panel) el.scrollTo({ left: panel.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: 'smooth' })
  }
  const alDeslizar = () => {
    const el = pizarra.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (grupos[i] && grupos[i][0] !== rubro) setRubro(grupos[i][0])
  }

  return (
    <section id="servicios" className="bloque bloque-negro">
      <div className="ancho">
        <div className="bloque-cabeza">
          <h2>Precios</h2>
          <p className="bloque-bajada">De noviembre. Se paga en el local con efectivo, transferencia, débito o Mercado Pago.</p>
        </div>
        {conRubros && <Rubros rubros={rubros} activo={rubro} elegir={irA} className="rubros-oscuro en-movil" />}
        <div className={`pizarra ${conRubros ? 'deslizable' : ''}`} ref={pizarra} onScroll={conRubros ? alDeslizar : undefined}>
          {grupos.map(([g, titulo]) => (
            <div className="grupo" key={g}>
              <h3>{titulo}</h3>
              {negocio.proximamente?.includes(g) && <p className="grupo-pronto">Próximamente en {negocio.nombreCorto}. Escribinos y te avisamos cuando arranque.</p>}
              <ul className="servicios">
                {e.servicios
                  .filter((s) => s.grupo === g)
                  .map((s) => {
                    const pronto = negocio.proximamente?.includes(g)
                    const contenido = (
                      <>
                        <span className="servicio-linea">
                          <span className="servicio-nombre">{s.nombre}</span>
                          <span className="servicio-puntos" aria-hidden="true" />
                          <span className="servicio-precio">
                            {pronto ? 'Pronto' : s.precioPorDia ? <><small>desde </small>{pesos(s.precio)}</> : pesos(s.precio)}
                          </span>
                        </span>
                        <span className="servicio-desc">
                          {s.descripcion} {!pronto && <span className="servicio-dur">{duracion(s.duracion)}</span>}
                          {s.precioPorDia && (
                            <span className="servicio-dias">
                              {preciosPorDia(s).map((t) => (
                                <span key={t.dias}>
                                  {t.dias} <b>{pesos(t.precio)}</b>
                                </span>
                              ))}
                            </span>
                          )}
                        </span>
                        {!pronto && <span className="servicio-reservar">Reservar</span>}
                      </>
                    )
                    return (
                      <li key={s.id}>
                        {pronto ? (
                          <div className="servicio servicio-pronto">{contenido}</div>
                        ) : (
                          <Link to={`/reservar?servicio=${s.id}`} className="servicio" aria-label={`Reservar ${s.nombre}, ${s.precioPorDia ? 'desde ' : ''}${pesos(s.precio)}`}>
                            {contenido}
                          </Link>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </div>
          ))}
        </div>
        {conRubros && (
          <p className="rubros-pista en-movil" aria-hidden="true">
            {grupos.map(([g]) => (
              <i key={g} className={g === rubro ? 'activo' : ''} />
            ))}
            Deslizá para ver {grupos.filter(([g]) => g !== rubro).map(([, t]) => t.toLowerCase()).join(' y ')}
          </p>
        )}
      </div>
    </section>
  )
}


function Trabajos() {
  return (
    <section id="trabajos" className="bloque bloque-marmol">
      <div className="ancho">
        <div className="bloque-cabeza">
          <h2>Trabajos</h2>
          <p className="bloque-bajada">
            Lo último que subieron a{' '}
            <a href={`https://instagram.com/${negocio.instagram}`} target="_blank" rel="noreferrer">
              @{negocio.instagram}
            </a>
            .
          </p>
        </div>
        <ul className="trabajos">
          {negocio.fotos.trabajos.map((foto) => (
            <li key={foto.src}>
              <img src={foto.src} alt={foto.alt} width={foto.ancho} height={foto.alto} loading="lazy" />
              <p>
                <strong>{foto.titulo}</strong>
                {negocio.inventado ? (
                  <span>@{negocio.instagram}</span>
                ) : foto.autor === negocio.instagram ? null : (
                  <a href={`https://instagram.com/${foto.autor}`} target="_blank" rel="noreferrer">
                    @{foto.autor}
                  </a>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** El servicio con el que se muestra a cada uno: el corte, o lo primero que hace (uñas, color). */
function servicioDe(e: ReturnType<typeof useDemo>, b: { hace?: string[] }) {
  return (e.servicios.find((s) => s.id === 'corte' && puedeHacer(b, s)) ?? e.servicios.find((s) => puedeHacer(b, s)))?.id ?? 'corte'
}

/** El primer hueco con esta persona en la próxima semana. */
function libreCon(e: ReturnType<typeof useDemo>, barberoId: string, sucursal: SucursalId, servicio: string) {
  for (let d = 0; d < 8; d++) {
    const dia = sumarDias(hoyClave(), d)
    const h = huecos(e, sucursal, dia, servicio, barberoId)
    if (h.length) return { dia, inicio: h[0].inicio }
  }
  return null
}

function Equipo() {
  const e = useDemo()
  return (
    <section id="equipo" className="bloque bloque-violeta">
      <div className="ancho">
        <div className="bloque-cabeza">
          <h2>Equipo</h2>
          <p className="bloque-bajada">Elegí con quién. Te mostramos cuándo tiene el próximo lugar cada uno.</p>
        </div>
        <ul className="equipo">
          {e.equipo.map((b) => {
            const sv = servicioDe(e, b)
            const l = libreCon(e, b.id, b.sucursal, sv)
            const destino = l
              ? `/reservar?suc=${b.sucursal}&servicio=${sv}&barbero=${b.id}&dia=${l.dia}&hora=${l.inicio}`
              : `/reservar?suc=${b.sucursal}&barbero=${b.id}`
            return (
              <li key={b.id}>
                <Link to={destino} className="barbero">
                  <span className="avatar" aria-hidden="true">
                    {b.nombre[0]}
                  </span>
                  <span className="barbero-nombre">{b.nombre}</span>
                  <span className="barbero-dato">
                    {b.rol ?? `${negocio.sucursales.find((s) => s.id === b.sucursal)!.nombre}, desde ${b.desde}`}
                  </span>
                  <span className="barbero-libre">{l ? `${capital(fechaRelativa(l.dia))}, ${hora(l.inicio)}` : 'Sin lugar esta semana'}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Resenas() {
  const [todas, setTodas] = useState(false)
  const lista = todas ? negocio.reseñas : negocio.reseñas.slice(0, 4)
  return (
    <section id="resenas" className="bloque">
      <div className="ancho resenas-cuerpo">
        <div className="resenas-cabeza">
          <h2>Reseñas</h2>
          <p className="resumen-numero">{negocio.calificacion.promedio.toLocaleString('es-AR')}</p>
          <Estrellas tamaño={22} />
          <p className="bloque-bajada">
            {negocio.calificacion.reseñas} reseñas en{' '}
            {negocio.google ? (
              <a href={negocio.google} target="_blank" rel="noreferrer">
                Google
              </a>
            ) : (
              'Google'
            )}
          </p>
        </div>
        <div>
          <ul className="resenas">
            {lista.map((r, i) => (
              <li key={i} className="resena">
                <blockquote>{r.texto}</blockquote>
                <p className="resena-cabeza">
                  <strong>{r.nombre}</strong>
                  <span>{r.cuando}</span>
                </p>
              </li>
            ))}
          </ul>
          {!todas && negocio.reseñas.length > 4 && (
            <button className="btn btn-secundario resenas-mas" onClick={() => setTodas(true)}>
              {negocio.reseñas.length - 4 === 1 ? 'Ver una reseña más' : `Ver ${negocio.reseñas.length - 4} reseñas más`}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function EnElLocal() {
  return (
    <section className="local" aria-label="En el local">
      {negocio.local.map((l) => (
        <article key={l.titulo} className={`local-item ${l.acento ? 'local-acento' : ''}`}>
          <img src={l.foto.src} alt={l.acento ? '' : l.foto.alt} width={l.foto.ancho} height={l.foto.alto} loading="lazy" />
          <div>
            <h2>{l.titulo}</h2>
            <p>{l.texto}</p>
            {l.whatsapp && (
              <a className="btn btn-blanco btn-chico" href={whatsapp(negocio.sucursales[0].telefono, l.whatsapp)} target="_blank" rel="noreferrer">
                {l.boton ?? 'Escribinos por WhatsApp'}
              </a>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

function Sucursales() {
  const e = useDemo()
  return (
    <section id="sucursales" className="bloque bloque-marmol">
      <div className="ancho">
        <div className="bloque-cabeza">
          <h2>{negocio.sucursales.length > 1 ? 'Sucursales' : 'Dónde estamos'}</h2>
        </div>
        <div className="sucursales">
          {negocio.sucursales.map((s, i) => {
            const ahora = estadoAhora(s.id)
            const equipo = e.equipo.filter((b) => b.sucursal === s.id)
            return (
              <article key={s.id} className={`sucursal ${i ? 'sucursal-violeta' : ''}`}>
                <h3>{s.nombre}</h3>
                <p className="sucursal-direccion">
                  {s.direccion}, {s.ciudad}
                </p>
                <p className={`abre ${ahora.abierto ? 'estado-abierto' : ''}`}>
                  <span className="punto" aria-hidden="true" />
                  {ahora.texto}
                </p>
                <table className="horario">
                  <tbody>
                    {filasHorario(s.id).map((h) => (
                      <tr key={h.dias}>
                        <th scope="row">{h.dias}</th>
                        <td>{h.horas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="sucursal-equipo">Atienden {equipo.map((b) => b.nombre).join(', ').replace(/, ([^,]*)$/, ' y $1')}.</p>
                <div className="sucursal-acciones">
                  <Link className="btn btn-blanco" to={`/reservar?suc=${s.id}`}>
                    Sacar turno acá
                  </Link>
                  <a className="btn btn-borde" href={whatsapp(s.telefono)} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                  <a className="btn btn-borde" href={s.mapa} target="_blank" rel="noreferrer">
                    Cómo llegar
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Pie() {
  return (
    <footer className="pie">
      <div className="ancho pie-cuerpo">
        <Link to="/" className="marca">
          <Logo tamaño={28} />
          <span>{negocio.nombre}</span>
        </Link>
        <ul>
          <li>
            <a href={`https://instagram.com/${negocio.instagram}`} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
          {negocio.sucursales.map((s) => (
            <li key={s.id}>
              <a href={s.mapa} target="_blank" rel="noreferrer">
                {s.nombre}, {s.direccion}
              </a>
            </li>
          ))}
          <li>
            <Link to="/admin">Panel del negocio</Link>
          </li>
        </ul>
        <Creditos />
      </div>
    </footer>
  )
}

/** En el celular, la acción principal queda siempre a mano abajo. */
function BarraTurno() {
  const desde = precioDesde(negocio.servicios.filter((s) => s.online))
  return (
    <div className="barra-turno">
      <p>
        Desde <strong>{pesos(desde)}</strong>
      </p>
      <Link to="/reservar" className="btn btn-primario">
        Sacar turno
      </Link>
    </div>
  )
}

export default function Sitio() {
  useEffect(() => {
    document.title = `${negocio.nombre}, ${negocio.rubro.toLowerCase()} en ${negocio.ciudad}`
  }, [])
  return (
    <div className="sitio">
      <BarraDemo />
      <Cabecera />
      <Portada />
      <main>
        <Servicios />
        <Trabajos />
        <Equipo />
        <Resenas />
        <EnElLocal />
        <Sucursales />
      </main>
      <Pie />
      <BarraTurno />
    </div>
  )
}
