import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// dalla home dell'iPhone l'app riprende da dov'era senza ricaricarsi: tornandoci, se è uscita
// una versione nuova (index.html punta a un altro script) si ricarica, ma mai a metà lezione
document.addEventListener('visibilitychange', async () => {
  if (document.hidden || location.hash.endsWith('/lezione')) return
  const html = await fetch('/', { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).catch(() => '')
  const current = document.querySelector('script[type="module"][src]')?.getAttribute('src')
  if (html && current && !html.includes(current)) location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
