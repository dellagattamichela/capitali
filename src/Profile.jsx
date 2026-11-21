import { useState } from 'react'
import { Avatar } from './Avatar.jsx'
import { PATHS } from './data'
import { SLOTS, full, isUnlocked, randomAvatar, unlockHint } from './avatarData.js'
import { learned, streakOn, today } from './game'

const TABS = [
  { icon: '😀', label: 'Viso', slots: ['skin', 'eyes', 'brows', 'nose', 'mouth', 'details'] },
  { icon: '💇', label: 'Capelli', slots: ['hair', 'hairColor', 'beard'] },
  { icon: '👕', label: 'Vestiti', slots: ['top', 'shirt', 'pin'] },
  { icon: '🎩', label: 'Accessori', slots: ['hat', 'glasses', 'ears'] },
  { icon: '🖼️', label: 'Sfondo', slots: ['bg'] },
]

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
      <button type="button" className="hero" style={{ background: SLOTS.bg.options[full(progress.avatar).bg].color }} onClick={onEdit} aria-label="Modifica avatar">
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

// si lavora su una bozza: "Salva" la conferma, ✕ la scarta (anche il dado si può annullare)
export function AvatarEditor({ avatar, stats, onSave, onBack }) {
  const saved = full(avatar)
  const [draft, setDraft] = useState(saved)
  const [tab, setTab] = useState(0)
  const changed = JSON.stringify(draft) !== JSON.stringify(saved)
  const set = (slot, value) => setDraft({ ...draft, [slot]: value })
  const cancel = () => {
    if (!changed || window.confirm('Uscire senza salvare le modifiche?')) onBack()
  }
  const save = () => {
    onSave(draft)
    onBack()
  }

  const choice = (slot, value, label, content, lock) => (
    <button key={value} type="button" className={`card choice ${draft[slot] === value ? 'selected' : ''}`} disabled={!!lock}
      aria-pressed={draft[slot] === value} aria-label={lock ? `${label}, bloccato: ${lock}` : label} title={label} onClick={() => set(slot, value)}>
      {content}
      {lock && <small className="lock">🔒 {lock}</small>}
    </button>
  )

  function section(slot) {
    if (slot === 'pin') {
      return (
        <section key={slot}>
          <h2>Spilla</h2>
          <div className="choices">
            {choice('pin', 'nessuna', 'nessuna', <Avatar a={{ ...draft, pin: 'nessuna' }} view="top" />)}
            {stats.learned.map((c) => choice('pin', c.code, c.name, <img className="swatch" src={`https://flagcdn.com/w80/${c.code}.png`} alt="" />))}
          </div>
          {!stats.learned.length && <p className="empty">Completa un'unità per ottenere le spille con le bandiere.</p>}
        </section>
      )
    }
    const { label, view, options } = SLOTS[slot]
    return (
      <section key={slot}>
        <h2>{label}</h2>
        <div className="choices">
          {Object.entries(options).filter(([, o]) => !o.hidden).map(([name, o]) =>
            choice(slot, name, name,
              // i colori come pastiglie, le forme come anteprima ingrandita sulla zona che cambia
              o.color && !o.front ? <span className="swatch" style={{ background: o.color }} /> : <Avatar a={{ ...draft, [slot]: name }} view={view} />,
              !isUnlocked(o, stats) && unlockHint(o)))}
        </div>
      </section>
    )
  }

  return (
    <main className="editor">
      <div className="editor-top">
        <header className="top">
          <button type="button" className="close" onClick={cancel} aria-label="Annulla">✕</button>
          <h1>Il tuo avatar</h1>
          <button type="button" className="dice" onClick={() => setDraft(randomAvatar(stats))} aria-label="Avatar a caso" title="Avatar a caso">🎲</button>
          <button type="button" className="btn small" onClick={save} disabled={!changed}>Salva</button>
        </header>
        <Avatar key={JSON.stringify(draft)} a={draft} className="big" />
        <div className="tabs">
          {TABS.map((t, i) => (
            <button key={t.label} type="button" aria-pressed={i === tab} onClick={() => setTab(i)}>
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>
      {TABS[tab].slots.map(section)}
    </main>
  )
}
