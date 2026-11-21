import { useState } from 'react'
import { PATHS } from './data'
import { learned, streakOn, today } from './game'

// --- avatar: strati SVG in un riquadro 100x100; per ogni parte si salva il nome dell'opzione scelta ---

const INK = '#3c3c3c'
const SKIN = { 'molto chiara': '#ffdbac', chiara: '#f1c27d', media: '#e0ac69', olivastra: '#c68642', scura: '#8d5524', 'molto scura': '#5c3a21' }
const HAIR_COLOR = { neri: '#2c1b10', castani: '#6b3e1f', biondi: '#e8b84a', rossi: '#c0441d', grigi: '#b8b8b8', blu: '#1cb0f6', viola: '#ce82ff' }
const SHIRT = { verde: '#58cc02', azzurra: '#1cb0f6', rossa: '#ff4b4b', gialla: '#ffc800', viola: '#ce82ff', arancione: '#ff9600', grigia: '#4b4b4b' }
const BG = { azzurro: '#ddf4ff', verde: '#d7ffb8', rosa: '#ffdfe0', giallo: '#fff4c2', lilla: '#f3e0ff', pesca: '#ffe8cc' }

const smile = <path d="M43 56 Q50 62 57 56" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
const FACES = {
  sorriso: <g><circle cx="41" cy="47" r="2.8" fill={INK} /><circle cx="59" cy="47" r="2.8" fill={INK} />{smile}</g>,
  felice: (
    <g fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round">
      <path d="M37 48 Q41 43 45 48" /><path d="M55 48 Q59 43 63 48" /><path d="M43 55 Q50 64 57 55 Z" fill={INK} />
    </g>
  ),
  occhioni: (
    <g>
      <circle cx="41" cy="47" r="5" fill="#fff" stroke={INK} strokeWidth="1.5" /><circle cx="59" cy="47" r="5" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <circle cx="42" cy="48" r="2.8" fill={INK} /><circle cx="60" cy="48" r="2.8" fill={INK} />{smile}
    </g>
  ),
  occhiolino: (
    <g>
      <circle cx="41" cy="47" r="2.8" fill={INK} />
      <path d="M55 47 Q59 44 63 47" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />{smile}
    </g>
  ),
}

// capelli: back dietro la testa, front davanti; il colore arriva dal gruppo che li contiene
const fringe = <path d="M27 46 C26 26 40 19 50 19 C60 19 74 26 73 46 C68 35 60 31 50 31 C40 31 32 35 27 46 Z" />
const HAIR = {
  nessuno: {},
  corti: { front: fringe },
  spettinati: { front: <path d="M27 46 C26 30 33 23 39 21 L37 11 L45 18 L50 8 L55 18 L63 11 L61 21 C68 24 74 32 73 46 C68 35 60 31 50 31 C40 31 32 35 27 46 Z" /> },
  caschetto: { back: <path d="M23 46 C23 18 77 18 77 46 L77 66 Q77 70 73 70 L27 70 Q23 70 23 66 Z" />, front: fringe },
  lunghi: {
    back: <path d="M23 46 C23 18 77 18 77 46 L79 82 L21 82 Z" />,
    front: <path d="M27 46 C25 24 44 17 55 19 C67 21 75 31 73 46 C66 35 54 29 42 33 C35 36 30 40 27 46 Z" />,
  },
  ricci: {
    back: <circle cx="50" cy="40" r="29" />,
    front: <g>{[[32, 34], [41, 27], [50, 24], [59, 27], [68, 34]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="8" />)}</g>,
  },
  chignon: { back: <circle cx="50" cy="16" r="9" />, front: fringe },
}

// accessori: currentColor = colore della maglia
const EXTRAS = {
  nessuno: null,
  occhiali: <g fill="none" stroke={INK} strokeWidth="2"><circle cx="41" cy="47" r="7" /><circle cx="59" cy="47" r="7" /><path d="M48 47 h4 M34 46 L28 44 M66 46 L72 44" /></g>,
  'occhiali da sole': <g fill="#222" stroke="#222" strokeWidth="2"><rect x="33" y="42" width="15" height="10" rx="4" /><rect x="52" y="42" width="15" height="10" rx="4" /><path d="M48 46 h4" /></g>,
  cappellino: <g fill="currentColor"><path d="M26 40 C26 16 74 16 74 40 Z" /><path d="M50 36 Q78 33 88 41 Q72 44 50 41 Z" /><circle cx="50" cy="19" r="3" /></g>,
  cuffie: <g fill="currentColor"><path d="M27 48 C25 14 75 14 73 48" fill="none" stroke={INK} strokeWidth="4" /><rect x="21" y="40" width="10" height="18" rx="5" /><rect x="69" y="40" width="10" height="18" rx="5" /></g>,
  corona: <path d="M33 24 L33 10 L41 18 L50 6 L59 18 L67 10 L67 24 Z" fill="#ffc800" stroke="#e0a800" strokeWidth="1.5" strokeLinejoin="round" />,
}

const PARTS = [
  ['skin', 'Pelle', SKIN], ['hair', 'Capelli', HAIR], ['hairColor', 'Colore capelli', HAIR_COLOR],
  ['face', 'Espressione', FACES], ['shirt', 'Maglia', SHIRT], ['extra', 'Accessori', EXTRAS], ['bg', 'Sfondo', BG],
]
// completa gli avatar salvati a cui manca una parte (nuovo utente, o parte aggiunta dopo)
const DEFAULT = { skin: 'chiara', hair: 'corti', hairColor: 'castani', face: 'sorriso', shirt: 'verde', extra: 'nessuno', bg: 'azzurro' }
const full = (a) => ({ ...DEFAULT, ...a })

export function Avatar({ a: avatar, className = '' }) {
  const a = full(avatar)
  return (
    <span className={`avatar ${className}`} style={{ background: BG[a.bg] }}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <g fill={HAIR_COLOR[a.hairColor]}>{HAIR[a.hair].back}</g>
        <g fill={SKIN[a.skin]}>
          <rect x="43" y="60" width="14" height="16" rx="5" />
          <circle cx="28" cy="48" r="5" /><circle cx="72" cy="48" r="5" />
        </g>
        <path d="M18 100 C18 80 32 72 50 72 C68 72 82 80 82 100 Z" fill={SHIRT[a.shirt]} />
        <circle cx="50" cy="46" r="22" fill={SKIN[a.skin]} />
        <g fill="#ff8fa3" opacity=".5"><circle cx="35" cy="55" r="3.5" /><circle cx="65" cy="55" r="3.5" /></g>
        {FACES[a.face]}
        <g fill={HAIR_COLOR[a.hairColor]}>{HAIR[a.hair].front}</g>
        <g style={{ color: SHIRT[a.shirt] }}>{EXTRAS[a.extra]}</g>
      </svg>
    </span>
  )
}

export function Profile({ progress, onChange, onEdit, onBack }) {
  const streak = streakOn(progress, today())
  const stats = [
    ['🔥', streak, 'Giorni di fila'],
    ['⚡', progress.xp, 'XP totali'],
    ['🏅', Math.max(progress.best, streak), 'Record di giorni'],
    ['🎓', PATHS.reduce((n, p) => n + learned(p, progress.done), 0), 'Città imparate'],
  ]
  // mezzogiorno locale: la data non scivola al giorno prima nei fusi orari a ovest
  const since = new Date(`${progress.since}T12:00`).toLocaleDateString('it', { month: 'long', year: 'numeric' })

  return (
    <main className="profile">
      <header className="top">
        <button type="button" className="close" onClick={onBack} aria-label="Indietro">←</button>
        <h1>Profilo</h1>
      </header>
      <button type="button" className="hero" style={{ background: BG[full(progress.avatar).bg] }} onClick={onEdit} aria-label="Modifica avatar">
        <Avatar a={progress.avatar} className="big" />
        <span className="edit" aria-hidden="true">✏️</span>
      </button>
      <input className="name" value={progress.name} onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Il tuo nome" maxLength={24} aria-label="Il tuo nome" autoComplete="off" />
      <p className="since">In viaggio da {since}</p>
      <h2>Statistiche</h2>
      <div className="stat-grid">
        {stats.map(([icon, value, label]) => (
          <div key={label} className="card stat"><strong>{icon} {value}</strong><small>{label}</small></div>
        ))}
      </div>
    </main>
  )
}

export function AvatarEditor({ avatar: saved, onChange, onBack }) {
  const [tab, setTab] = useState(0)
  const [key, label, options] = PARTS[tab]
  const avatar = full(saved)
  const pickAny = (o) => { const names = Object.keys(o); return names[Math.floor(Math.random() * names.length)] }
  const random = () => onChange(Object.fromEntries(PARTS.map(([k, , o]) => [k, pickAny(o)])))

  return (
    <main className="editor">
      <header className="top">
        <button type="button" className="close" onClick={onBack} aria-label="Indietro">←</button>
        <h1>Il tuo avatar</h1>
        <button type="button" className="dice" onClick={random} aria-label="Avatar a caso" title="Avatar a caso">🎲</button>
      </header>
      <Avatar a={avatar} className="big" />
      <div className="tabs">
        {PARTS.map(([k, l], t) => (
          <button key={k} type="button" aria-pressed={t === tab} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>
      <div className="choices">
        {Object.entries(options).map(([name, o]) => (
          <button key={name} type="button" className={`card choice ${avatar[key] === name ? 'selected' : ''}`}
            aria-pressed={avatar[key] === name} aria-label={`${label}: ${name}`} title={name} onClick={() => onChange({ ...avatar, [key]: name })}>
            {/* i colori come pastiglie, le forme come anteprima dell'avatar */}
            {typeof o === 'string' ? <span className="swatch" style={{ background: o }} /> : <Avatar a={{ ...avatar, [key]: name }} />}
          </button>
        ))}
      </div>
      <button type="button" className="btn green" onClick={onBack}>Fatto</button>
    </main>
  )
}
