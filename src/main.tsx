import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { negocio } from './config/negocio'

// Las animaciones de entrada solo se activan si corre JavaScript.
document.documentElement.classList.add('js')

// El color de la marca del negocio, para la web y el panel
const { acento, hover, claro, tenue, tinta } = negocio.colores
Object.entries({ '--marca': acento, '--marca-hover': hover, '--marca-claro': claro, '--marca-tenue': tenue, '--marca-tinta': tinta }).forEach(([k, v]) =>
  document.documentElement.style.setProperty(k, v),
)

// Para la estética propia de cada negocio en el CSS ([data-negocio="rene"])
document.documentElement.dataset.negocio = negocio.id

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
