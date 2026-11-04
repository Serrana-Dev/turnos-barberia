import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gruposDe, negocio, personaDe, precioDe, puedeHacer, type SucursalId } from '../config/negocio'
import { duracion, fechaCorta, fechaLarga, fechaRelativa, hora, hoyClave, pesos, sumarDias, capital } from '../lib/formato'
import { abierto, crearCliente, crearTurno, huecos, useDemo } from '../lib/store'
import type { Turno } from '../lib/tipos'
import { CalendarPlus, Check, CheckCheck, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { Logo } from '../lib/ui'
import { BarraDemo } from './comun'
import { armarRubros, Rubros } from './Rubros'

/** El turno como evento de calendario (.ics), para agendarlo en el celular con un toque. */
function enlaceCalendario(t: Turno, titulo: string, lugar: string) {
  const fecha = (min: number) => `${t.dia.replace(/-/g, '')}T${String(Math.floor(min / 60)).padStart(2, '0')}${String(min % 60).padStart(2, '0')}00`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sillon//Turnos//ES',
    'BEGIN:VEVENT',
    `UID:${t.id}@sillon`,
    `DTSTART:${fecha(t.inicio)}`,
    `DTEND:${fecha(t.inicio + t.duracion)}`,
    `SUMMARY:${titulo}`,
    `LOCATION:${lugar}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${titulo}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

function CabeceraReserva({ atras }: { atras?: () => void }) {
  return (
    <header className="cabecera">
      {atras ? (
        <button className="volver" onClick={atras} aria-label="Paso anterior">
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
      ) : (
        <Link to="/" className="volver" aria-label="Volver al inicio">
          <ChevronLeft size={22} aria-hidden="true" />
        </Link>
      )}
      <Link to="/" className="marca">
        <Logo tamaño={28} />
        <span>{negocio.nombre}</span>
      </Link>
    </header>
  )
}

type Paso = 'suc' | 'servicio' | 'barbero' | 'hora' | 'datos'
const nombres: Record<Paso, string> = { suc: 'Local', servicio: 'Servicio', barbero: personaDe(negocio)[0], hora: 'Horario', datos: 'Tus datos' }
const titulos: Record<Paso, string> = {
  suc: '¿A qué local venís?',
  servicio: '¿Qué te hacés?',
  barbero: '¿Con quién?',
  hora: '¿Cuándo?',
  datos: 'Último paso',
}

/** La línea de pasos de arriba: los hechos se tocan para volver, el actual se marca. */
function LineaPasos({ pasos, actual, hechos, ir }: { pasos: Paso[]; actual: number; hechos: boolean[]; ir: (i: number) => void }) {
  return (
    <ol className="linea-pasos" aria-label="Pasos para sacar turno">
      {pasos.map((p, i) => {
        const estado = i === actual ? 'actual' : hechos[i] ? 'hecho' : 'falta'
        return (
          <li key={p} className={`linea-paso ${estado}`}>
            <button onClick={() => ir(i)} disabled={estado === 'falta' && i > actual} aria-current={i === actual ? 'step' : undefined}>
              <span className="linea-circulo">{estado === 'hecho' ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : i + 1}</span>
              <span className="linea-nombre">{nombres[p]}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

/** Una opción grande para tocar: al elegirla se pasa solo al paso siguiente. */
function Opcion({ elegida, onClick, children, className = '' }: { elegida: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button className={`opcion ${elegida ? 'elegida' : ''} ${className}`} onClick={onClick} aria-pressed={elegida}>
      {children}
      <span className="opcion-flecha" aria-hidden="true">
        {elegida ? <Check size={18} strokeWidth={3} /> : <ChevronRight size={18} />}
      </span>
    </button>
  )
}

const franjaDe = (min: number) => (min < 720 ? 'Mañana' : min < 1140 ? 'Tarde' : 'Noche')

export default function Reservar() {
  const e = useDemo()
  const [q] = useSearchParams()
  const hoy = hoyClave()
  const unaSucursal = negocio.sucursales.length === 1

  const [suc, setSuc] = useState<SucursalId | null>((q.get('suc') as SucursalId) || (unaSucursal ? negocio.sucursales[0].id : null))
  const [servicio, setServicio] = useState<string | null>(q.get('servicio'))
  const [barbero, setBarbero] = useState<string | null>(q.get('barbero') ?? (q.get('suc') ? 'cualquiera' : null))
  const [dia, setDia] = useState<string | null>(q.get('dia'))
  const [inicio, setInicio] = useState<number | null>(q.get('hora') ? Number(q.get('hora')) : null)
  const [nombre, setNombre] = useState('')
  const [tel, setTel] = useState('')
  const [hecho, setHecho] = useState<Turno | null>(null)

  const pasos: Paso[] = unaSucursal ? ['servicio', 'barbero', 'hora', 'datos'] : ['suc', 'servicio', 'barbero', 'hora', 'datos']
  const completo: Record<Paso, boolean> = { suc: !!suc, servicio: !!servicio, barbero: !!barbero, hora: dia !== null && inicio !== null, datos: false }
  const primeroQueFalta = Math.max(0, pasos.findIndex((p) => !completo[p]))
  const [paso, setPaso] = useState(primeroQueFalta)
  const [haciaAtras, setHaciaAtras] = useState(false)
  const actual = pasos[paso]
  const cuerpo = useRef<HTMLDivElement>(null)

  const ir = (i: number) => {
    setHaciaAtras(i < paso)
    setPaso(i)
  }
  const siguiente = () => ir(Math.min(pasos.length - 1, paso + 1))

  useEffect(() => {
    document.title = `Sacar turno, ${negocio.nombre}`
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
    cuerpo.current?.focus({ preventScroll: true })
  }, [paso])

  const s = e.servicios.find((x) => x.id === servicio)
  // Con muchos servicios (barbería, peluquería y uñas) se elige primero el rubro, para no scrollear de más
  const rubros = gruposDe(negocio).filter(([g]) => e.servicios.some((x) => x.online && x.grupo === g))
  const conPestanas = !!negocio.grupos && rubros.length > 1
  const [rubro, setRubro] = useState(() => s?.grupo ?? rubros[0]?.[0])
  const sucursal = negocio.sucursales.find((x) => x.id === suc)
  // Solo quienes hacen el servicio elegido (en un salón unisex, las uñas no las hace el barbero)
  const equipo = e.equipo.filter((b) => b.sucursal === suc && puedeHacer(b, s))
  const quien = barbero === 'cualquiera' ? undefined : barbero ?? undefined

  const diasAbiertos = useMemo(() => {
    if (!suc) return []
    const lista: string[] = []
    for (let i = 0; lista.length < 14 && i < 28; i++) {
      const d = sumarDias(hoy, i)
      if (abierto(suc, d)) lista.push(d)
    }
    return lista
  }, [suc, hoy])

  const libresPorDia = useMemo(() => {
    const m: Record<string, number> = {}
    if (suc && servicio) for (const d of diasAbiertos) m[d] = huecos(e, suc, d, servicio, quien).length
    return m
  }, [e, suc, servicio, quien, diasAbiertos])

  // Si todavía no hay día elegido, se muestra el primero con lugar
  const diaVisto = dia ?? diasAbiertos.find((d) => libresPorDia[d]) ?? diasAbiertos[0] ?? null
  const libres = useMemo(() => (suc && servicio && diaVisto ? huecos(e, suc, diaVisto, servicio, quien) : []), [e, suc, servicio, diaVisto, quien])

  /** El primer lugar de cada barbero, para elegir con quién sabiendo cuándo puede. */
  const primeroDe = useMemo(() => {
    const m: Record<string, { dia: string; inicio: number } | null> = {}
    if (!suc || !servicio) return m
    for (const b of [{ id: 'cualquiera' }, ...equipo]) {
      m[b.id] = null
      for (const d of diasAbiertos) {
        const h = huecos(e, suc, d, servicio, b.id === 'cualquiera' ? undefined : b.id)
        if (h.length) {
          m[b.id] = { dia: d, inicio: h[0].inicio }
          break
        }
      }
    }
    return m
  }, [e, suc, servicio, equipo, diasAbiertos])

  const hueco = dia && inicio !== null ? huecos(e, suc ?? '', dia, servicio ?? '', quien).find((h) => h.inicio === inicio) : undefined
  const barberoFinal = barbero && barbero !== 'cualquiera' ? barbero : hueco?.barberoId
  const cuandoTexto = (x: { dia: string; inicio: number } | null) => (x ? `${capital(fechaRelativa(x.dia))}, ${hora(x.inicio)}` : 'Sin lugar en dos semanas')

  function confirmar(ev: FormEvent) {
    ev.preventDefault()
    if (!suc || !servicio || !dia || inicio === null || !barberoFinal) return
    const cliente = crearCliente({ nombre: nombre.trim(), telefono: tel.trim() })
    const t = crearTurno({ clienteId: cliente.id, barberoId: barberoFinal, servicioId: servicio, sucursal: suc, dia, inicio, origen: 'web' })
    setHecho(t)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (hecho) {
    const b = e.equipo.find((x) => x.id === hecho.barberoId)!
    const sv = e.servicios.find((x) => x.id === hecho.servicioId)!
    const sc = negocio.sucursales.find((x) => x.id === hecho.sucursal)!
    return (
      <div className="reservar">
        <BarraDemo a={`/admin/agenda?dia=${hecho.dia}&suc=${hecho.sucursal}`} texto="Ver el turno en la agenda del negocio" />
        <CabeceraReserva />
        <main className="reservar-cuerpo">
          <section className="confirmado" aria-live="polite">
            <svg className="confirmado-check" viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="24" />
              <path d="M15 27l7 7 15-16" />
            </svg>
            <p className="confirmado-sello">Turno confirmado</p>
            <h1>
              {capital(fechaRelativa(hecho.dia) === 'hoy' || fechaRelativa(hecho.dia) === 'mañana' ? fechaRelativa(hecho.dia) : fechaLarga(hecho.dia))} a las {hora(hecho.inicio)}
            </h1>
            <dl className="confirmado-datos">
              <div><dt>Servicio</dt><dd>{sv.nombre}, {pesos(hecho.precio)}</dd></div>
              <div><dt>{personaDe(negocio)[0]}</dt><dd>{b.nombre}</dd></div>
              <div><dt>Dónde</dt><dd>{sc.direccion}, {unaSucursal ? sc.ciudad : sc.nombre}</dd></div>
              <div><dt>A nombre de</dt><dd>{nombre}</dd></div>
              <div><dt>Número</dt><dd>{hecho.numero}</dd></div>
            </dl>
            <div className="confirmado-acciones">
              <a
                className="btn btn-primario"
                href={enlaceCalendario(hecho, `${sv.nombre} con ${b.nombre}, ${negocio.nombre}`, `${sc.direccion}, ${sc.ciudad}`)}
                download={`turno-${hecho.numero}.ics`}
              >
                <CalendarPlus size={18} aria-hidden="true" /> Agendar
              </a>
              <a className="btn btn-secundario" href={sc.mapa} target="_blank" rel="noreferrer">
                <MapPin size={18} aria-hidden="true" /> Cómo llegar
              </a>
            </div>
          </section>

          <section className="wa" aria-label="Lo que te llega por WhatsApp">
            <p className="wa-titulo">Lo que te llega por WhatsApp</p>
            <div className="wa-chat">
              <p className="wa-dia">Ahora</p>
              <p className="wa-burbuja">
                ¡Listo, {nombre.split(' ')[0]}! Tu turno quedó para {fechaRelativa(hecho.dia)} a las {hora(hecho.inicio)} con {b.nombre}, en {sc.direccion}. Número {hecho.numero}.
                <time>
                  {hora(Math.min(1439, new Date().getHours() * 60 + new Date().getMinutes()))} <CheckCheck size={14} aria-hidden="true" />
                </time>
              </p>
              <p className="wa-dia">El día anterior</p>
              <p className="wa-burbuja">
                Hola {nombre.split(' ')[0]}, te esperamos mañana a las {hora(hecho.inicio)} para {sv.nombre.toLowerCase()} con {b.nombre}. ¿Venís? Respondé SÍ o NO.
                <time>
                  10:00 <CheckCheck size={14} aria-hidden="true" />
                </time>
              </p>
              <p className="wa-burbuja wa-mia">
                SÍ
                <time>10:02</time>
              </p>
            </div>
            <p className="wa-nota">Si respondés NO, el lugar se libera solo y lo puede tomar otro.</p>
            <Link className="btn btn-secundario btn-ancho" to="/">Volver al inicio</Link>
          </section>
        </main>
      </div>
    )
  }

  // Lo elegido hasta ahora, abajo como en las apps de turnos
  const resumen = [
    !unaSucursal && sucursal ? sucursal.nombre : null,
    s ? s.nombre : null,
    barbero ? (barbero === 'cualquiera' ? 'El primero libre' : equipo.find((b) => b.id === barbero)?.nombre) : null,
    dia && inicio !== null ? `${capital(fechaRelativa(dia))} ${hora(inicio)}` : null,
  ].filter(Boolean) as string[]

  const porFranja = libres.reduce<Record<string, typeof libres>>((m, h) => {
    ;(m[franjaDe(h.inicio)] ??= []).push(h)
    return m
  }, {})

  return (
    <div className="reservar reservar-pasos">
      <BarraDemo />
      <CabeceraReserva atras={paso > 0 ? () => ir(paso - 1) : undefined} />
      <div className="pasos-cabeza">
        <LineaPasos pasos={pasos} actual={paso} hechos={pasos.map((p) => completo[p])} ir={ir} />
      </div>

      <main className="reservar-cuerpo">
        <div key={actual} ref={cuerpo} tabIndex={-1} className={`paso-pantalla ${haciaAtras ? 'desde-izquierda' : 'desde-derecha'}`}>
          <p className="paso-de">
            Paso {paso + 1} de {pasos.length}
          </p>
          <h1>{titulos[actual]}</h1>

          {actual === 'suc' && (
            <div className="opciones">
              {negocio.sucursales.map((x) => (
                <Opcion key={x.id} elegida={suc === x.id} onClick={() => { setSuc(x.id); setBarbero(null); setDia(null); setInicio(null); siguiente() }}>
                  <span className="opcion-icono" aria-hidden="true">
                    <MapPin size={20} />
                  </span>
                  <span className="opcion-texto">
                    <strong>{x.nombre}</strong>
                    <small>{x.direccion}, {x.ciudad}</small>
                  </span>
                </Opcion>
              ))}
            </div>
          )}

          {actual === 'servicio' && (
            <div className="opciones">
              {conPestanas && (
                <Rubros rubros={armarRubros(rubros, e.servicios.filter((x) => x.online))} activo={rubro} elegir={setRubro} className="rubros-claro" />
              )}
              {gruposDe(negocio).map(([g, titulo]) => {
                const lista = e.servicios.filter((x) => x.online && x.grupo === g)
                if (!lista.length || (conPestanas && g !== rubro)) return null
                return (
                  <div key={g} className={`opciones-grupo ${conPestanas ? 'opciones-rubro' : ''}`}>
                    {!conPestanas && <h2>{titulo}</h2>}
                    {lista.map((x) => (
                      <Opcion key={x.id} elegida={servicio === x.id} onClick={() => {
                        setServicio(x.id)
                        setInicio(null)
                        const elegido = e.equipo.find((b) => b.id === barbero)
                        if (elegido && !puedeHacer(elegido, x)) setBarbero(null)
                        siguiente()
                      }}>
                        <span className="opcion-texto">
                          <strong>{x.nombre}</strong>
                          <small>
                            {duracion(x.duracion)}. {x.descripcion}
                          </small>
                        </span>
                        <span className="opcion-precio">{x.precioPorDia && <small>desde </small>}{pesos(x.precio)}</span>
                      </Opcion>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {actual === 'barbero' && (
            <div className="opciones">
              {equipo.length > 1 && (
                <Opcion elegida={barbero === 'cualquiera'} onClick={() => { setBarbero('cualquiera'); setDia(null); setInicio(null); siguiente() }} className="opcion-destacada">
                  <span className="avatar avatar-todos" aria-hidden="true">
                    {equipo.length}
                  </span>
                  <span className="opcion-texto">
                    <strong>El primero que esté libre</strong>
                    <small>{cuandoTexto(primeroDe.cualquiera)}</small>
                  </span>
                </Opcion>
              )}
              {equipo.map((b) => (
                <Opcion key={b.id} elegida={barbero === b.id} onClick={() => { setBarbero(b.id); setDia(null); setInicio(null); siguiente() }}>
                  <span className="avatar" style={{ ['--tono' as string]: b.tono }} aria-hidden="true">
                    {b.nombre[0]}
                  </span>
                  <span className="opcion-texto">
                    <strong>{b.nombre}</strong>
                    <small>Próximo lugar: {cuandoTexto(primeroDe[b.id])}</small>
                  </span>
                </Opcion>
              ))}
            </div>
          )}

          {actual === 'hora' && (
            <>
              <div className="dias" role="listbox" aria-label="Día">
                {diasAbiertos.map((d) => (
                  <button
                    key={d}
                    role="option"
                    aria-selected={diaVisto === d}
                    className={`dia ${diaVisto === d ? 'activa' : ''}`}
                    disabled={!libresPorDia[d]}
                    onClick={() => { setDia(d); setInicio(null) }}
                  >
                    <span>{d === hoy ? 'Hoy' : fechaCorta(d).split(' ')[0]}</span>
                    <strong>{Number(d.slice(8))}</strong>
                    <small className={s?.precioPorDia && libresPorDia[d] ? 'dia-precio' : ''}>
                      {!libresPorDia[d] ? 'Sin lugar' : s?.precioPorDia ? pesos(precioDe(s, d)) : libresPorDia[d] === 1 ? '1 libre' : `${libresPorDia[d]} libres`}
                    </small>
                  </button>
                ))}
              </div>
              {diaVisto && <p className="dia-elegido">{capital(fechaLarga(diaVisto))}</p>}
              {libres.length === 0 ? (
                <p className="sin-lugar">No quedan horarios este día. Probá con otro.</p>
              ) : (
                (['Mañana', 'Tarde', 'Noche'] as const).map(
                  (f) =>
                    porFranja[f] && (
                      <section key={f} className="franja">
                        <h2>{f}</h2>
                        <div className="horas">
                          {porFranja[f].map((h) => (
                            <button
                              key={h.inicio}
                              className={`hora ${dia === diaVisto && inicio === h.inicio ? 'activa' : ''}`}
                              onClick={() => { setDia(diaVisto); setInicio(h.inicio); siguiente() }}
                            >
                              {hora(h.inicio)}
                            </button>
                          ))}
                        </div>
                      </section>
                    ),
                )
              )}
            </>
          )}

          {actual === 'datos' && (
            <form id="form-datos" className="datos" onSubmit={confirmar}>
              {s && dia && inicio !== null && (
                <div className="datos-ticket">
                  <p className="datos-ticket-cuando">
                    {capital(fechaRelativa(dia))} a las {hora(inicio)}
                  </p>
                  <p>
                    {s.nombre} con {equipo.find((b) => b.id === barberoFinal)?.nombre ?? 'el primero libre'}
                  </p>
                  <p>
                    {sucursal?.direccion}, {sucursal?.nombre}
                  </p>
                  <p className="datos-ticket-total">
                    {pesos(precioDe(s, dia ?? diaVisto ?? undefined))} <small>se paga en el local</small>
                  </p>
                </div>
              )}
              <label>
                Nombre y apellido
                <input required name="nombre" value={nombre} onChange={(ev) => setNombre(ev.target.value)} autoComplete="name" enterKeyHint="next" />
              </label>
              <label>
                WhatsApp
                <input
                  required
                  name="telefono"
                  type="tel"
                  value={tel}
                  onChange={(ev) => setTel(ev.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="send"
                  placeholder="351 000-0000…"
                  aria-describedby="tel-ayuda"
                />
                <small id="tel-ayuda">Por acá te llega la confirmación y el recordatorio.</small>
              </label>
            </form>
          )}
        </div>
      </main>

      {(resumen.length > 0 || actual === 'datos') && (
        <div className="pasos-pie">
          <div className="pasos-elegido">
            {resumen.map((r) => (
              <span key={r}>{r}</span>
            ))}
            {s && <strong>{pesos(precioDe(s, actual === 'hora' || dia ? (dia ?? diaVisto ?? undefined) : undefined))}</strong>}
          </div>
          {actual === 'datos' ? (
            <button className="btn btn-primario btn-ancho" type="submit" form="form-datos" disabled={!nombre.trim() || !tel.trim()}>
              Confirmar turno
            </button>
          ) : (
            completo[actual] && (
              <button className="btn btn-primario btn-ancho" onClick={siguiente}>
                Seguir
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
