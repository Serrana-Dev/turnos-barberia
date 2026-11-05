// Quién está usando el panel. Solo en las demos con negocio.accesos (René): ahí se elige entrar como dueño o staff.
// En las demás se entra directo como dueño, como siempre.
// Vive en sessionStorage: al cerrar la pestaña se vuelve a elegir.
import { negocio, type Acceso } from '../config/negocio'

export type Sesion = { quien: string; rol: Acceso['rol'] }

const CLAVE = `panel-sesion-${negocio.id}`

export const eligeRol = !!negocio.accesos?.length

export function leerSesion(): Sesion | null {
  if (!eligeRol) return { quien: '', rol: 'dueño' }
  try {
    const s = JSON.parse(sessionStorage.getItem(CLAVE) ?? 'null') as Sesion | null
    return s && negocio.accesos!.some((a) => a.quien === s.quien && a.rol === s.rol) ? s : null
  } catch {
    return null
  }
}

/** Entra como esa persona y lo recuerda en esta pestaña. */
export function entrar(quien: string): Sesion | null {
  const a = negocio.accesos?.find((x) => x.quien === quien)
  if (!a) return null
  const s: Sesion = { quien: a.quien, rol: a.rol }
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(s))
  } catch {
    // Sin sessionStorage (modo privado): la sesión dura hasta recargar
  }
  return s
}

export function salir() {
  try {
    sessionStorage.removeItem(CLAVE)
  } catch {
    // nada que borrar
  }
}

/** Las pantallas que ve un empleado. El resto (caja, reportes, clientes, precios) es del dueño. */
export const delEmpleado = ['/admin', '/admin/agenda']
