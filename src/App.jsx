import { useEffect, useState } from 'react'
import { PATHS } from './data'
import { STEPS, XP_PER_LESSON, finishLesson, isOpen, jumpTest, learned, makeLesson, nodesOf, normalize, partOf, streakOn, today } from './game'
import { AvatarEditor, Profile } from './Profile'
import { Avatar } from './Avatar.jsx'
import { avatarStats, full, newUnlocks } from './avatarData.js'

// un'icona per passo, nell'ordine di STEPS (game.js): i primi due sono entrambi a scelta multipla,
// il primo con le risposte suggerite, il secondo per allenarsi senza
const STEP_UI = [
  { icon: '/bullseye.png', label: 'Scelta multipla' },
  { icon: '/dumbbell.png', label: 'Allenamento' },
  { icon: '/puzzle.png', label: 'Sillabe' },
  { icon: '/feather.png', label: 'Scrittura' },
  { icon: '/quiz.png', label: 'Ripasso' },
]
const KEY = 'capitali-progress' // nome storico del progetto: cambiarlo cancellerebbe i progressi salvati
const EMPTY = { done: [], parts: {}, xp: 0, streak: 0, best: 0, lastDay: null, last: null, name: '', avatar: {} }
const TEST_LIVES = 3

function load() {
  try {
    return { ...EMPTY, since: today(), ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return { ...EMPTY, since: today() }
  }
}

// navigazione nell'hash, così funziona il tasto indietro:
// "" = home, "#europa" = percorso, "#europa/lezione", "#profilo", "#profilo/avatar"
// aprendo l'app su un percorso si rimette la home sotto nella cronologia: "indietro" porta sempre lì
if (location.hash) {
  const [id] = location.hash.slice(1).split('/')
  history.replaceState(null, '', location.pathname)
  history.pushState(null, '', `#${id}`)
}

function useHash() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const update = () => setHash(location.hash)
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return hash.slice(1).split('/')
}

export default function App() {
  const [progress, setProgress] = useState(load)
  const [lesson, setLesson] = useState(null)
  const [pathId, view] = useHash()
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  const update = (patch) => setProgress((p) => ({ ...p, ...patch }))
  const back = () => history.back()

  if (pathId === 'profilo') {
    return view === 'avatar'
      ? <AvatarEditor avatar={progress.avatar} stats={avatarStats(progress)} onSave={(avatar) => update({ avatar })} onBack={back} />
      : <Profile progress={progress} onChange={update} onBack={back} onEdit={() => {
          location.hash = 'profilo/avatar'
        }} />
  }

  const path = PATHS.find((p) => p.id === pathId && isOpen(p, progress.done))
  const start = (p, node) => {
    setLesson({ path: p, node, questions: makeLesson(p, node, partOf(progress, node)), id: Date.now() })
    location.hash = `${p.id}/lezione`
  }

  if (path && view === 'lezione' && lesson?.path === path) {
    const { node } = lesson
    const finish = () => {
      const next = finishLesson(progress, path.id, node, today())
      setLesson({ ...lesson, unlocks: newUnlocks(avatarStats(progress), avatarStats(next)) })
      setProgress(next)
    }
    const exit = () => {
      setLesson(null)
      history.back()
    }
    const wear = (slot, name) => update({ avatar: { ...full(progress.avatar), [slot]: name } })
    return <Lesson key={lesson.id} {...lesson} avatar={progress.avatar} onFinish={finish} onWear={wear} onExit={exit} />
  }
  if (path) return <PathView path={path} progress={progress} avatar={progress.avatar} onStart={(n) => start(path, n)} onBack={back} />
  return (
    <Home progress={progress}
      onOpen={(id) => {
        location.hash = id
      }}
      onStart={(p, n) => {
        history.pushState(null, '', `#${p.id}`) // uscendo dalla lezione si torna al percorso
        start(p, n)
      }} />
  )
}

const count = (units) => units.reduce((n, u) => n + u.countries.length, 0)

function Home({ progress, onOpen, onStart }) {
  const { done } = progress
  const last = PATHS.find((p) => p.id === progress.last) ?? PATHS[0]
  const next = nodesOf(last).find((n) => !done.includes(n.id))

  return (
    <main className="home">
      <header className="stats">
        <span className="streak" title="Giorni di fila">🔥 {streakOn(progress, today())}</span>
        <span className="xp">⚡ {progress.xp} XP</span>
        <button type="button" className="me" onClick={() => onOpen('profilo')} aria-label="Profilo">
          <Avatar a={progress.avatar} />
        </button>
      </header>

      {next && (
        <div className="card continue">
          <span>
            <small>{progress.last ? 'Continua' : 'Inizia da qui'}</small>
            <strong>{last.title} · Unità {next.u + 1}</strong>
          </span>
          <button className="btn green" onClick={() => onStart(last, next)}>Vai</button>
        </div>
      )}

      {PATHS.map((p) => {
        const open = isOpen(p, done)
        const nodes = nodesOf(p)
        const pct = (nodes.filter((n) => done.includes(n.id)).length / nodes.length) * 100
        const [reqPath, reqUnit] = p.unlockedBy?.split('.') ?? []
        const req = PATHS.find((x) => x.id === reqPath)?.units.find((u) => u.id === reqUnit)
        return (
          <button key={p.id} className={`card path-card ${p.unlockedBy ? 'sub' : ''}`} disabled={!open} onClick={() => onOpen(p.id)}>
            <span className="icon">{open ? p.icon : <img src="/padlock.png" alt="" />}</span>
            <span className="info">
              <strong>{p.title}</strong>
              {open ? (
                <span className="meter">
                  <span className="progress"><span style={{ width: `${pct}%` }} /></span>
                  <small>{learned(p, done)}/{count(p.units)}</small>
                </span>
              ) : (
                <small>Completa l'unità «{req.title}» per sbloccarlo</small>
              )}
            </span>
          </button>
        )
      })}
    </main>
  )
}

function PathView({ path, progress, avatar, onStart, onBack }) {
  const { done } = progress
  const nodes = nodesOf(path)
  const current = nodes.findIndex((n) => !done.includes(n.id))
  useEffect(() => {
    document.querySelector('.node.current')?.scrollIntoView({ block: 'center' })
  }, [])

  return (
    <main className="path">
      <header className="top">
        <button type="button" className="close" onClick={onBack} aria-label="Indietro">←</button>
        <h1>{path.icon} {path.title}</h1>
      </header>
      {path.units.map((unit, u) => (
        <section key={unit.id} className="unit">
          <div className="banner">
            <h2>
              <small>Unità {u + 1}</small>
              {unit.title}
              <span>{unit.countries.map((c) => c.name).join(', ')}</span>
            </h2>
            {current !== -1 && u * STEPS.length > current && (
              <button type="button" className="jump" onClick={() => onStart(jumpTest(path, u))}>Salta qui</button>
            )}
          </div>
          <div className="nodes">
            {nodes.filter((n) => n.u === u).map((n) => {
              const k = nodes.indexOf(n)
              const state = done.includes(n.id) ? 'done' : k === current ? 'current' : 'locked'
              const { icon, label } = STEP_UI[n.s]
              const part = partOf(progress, n)
              const ring = state === 'current' && n.parts > 1 // i trattini: uno per lezione del passo
              return (
                <button key={n.id} type="button" className={`node ${state} ${ring ? 'ring' : ''}`} style={{ '--k': k, '--n': n.parts, '--p': part / n.parts }}
                  disabled={state === 'locked'} onClick={() => onStart(n)}
                  aria-label={`${label}${state === 'done' ? ', completata' : state === 'locked' ? ', bloccata' : ring ? `, lezione ${part + 1} di ${n.parts}` : ''}`}>
                  <img src={icon} alt="" className={n.type} />
                  {state === 'current' && <Avatar a={avatar} className="here" />}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}

const emptyFor = (q) => (q?.level === 'medium' ? [] : '')

function Lesson({ path, node, questions, avatar, unlocks = [], onFinish, onWear, onExit }) {
  const [queue, setQueue] = useState(questions) // le domande sbagliate si ripetono in fondo
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState(emptyFor(questions[0]))
  const [result, setResult] = useState(null) // null = non ancora verificato, true/false = esito
  const [score, setScore] = useState(0)
  const isTest = node.type === 'test'
  const mistakes = queue.length - questions.length

  if (isTest && mistakes >= TEST_LIVES) {
    return (
      <main className="done">
        <Avatar a={avatar} mood="triste" className="big" />
        <h1 className="fail">Test non superato</h1>
        <p className="subtitle">Nessun problema: segui il percorso e riprova quando vuoi.</p>
        <button className="btn green" onClick={onExit}>Torna al percorso</button>
      </main>
    )
  }

  if (i === queue.length) {
    return (
      <main className="done">
        <Avatar a={avatar} mood="felice" className="big" />
        <h1>{isTest ? 'Test superato!' : 'Lezione completata!'}</h1>
        <div className="row">
          <div className="card score"><small>XP</small><strong>+{XP_PER_LESSON}</strong></div>
          <div className="card score"><small>Precisione</small><strong>{Math.round((100 * questions.length) / queue.length)}%</strong></div>
        </div>
        {unlocks.map(({ slot, name }) => {
          const worn = full(avatar)[slot] === name
          return (
            <div key={name} className="card unlock">
              <Avatar a={{ ...avatar, [slot]: name }} />
              <span><small>🎁 Nuovo oggetto per l'avatar!</small><strong>{name}</strong></span>
              <button type="button" className="btn ghost small" disabled={worn} onClick={() => onWear(slot, name)}>{worn ? 'Indossato' : 'Indossa'}</button>
            </div>
          )
        })}
        <button className="btn green" onClick={onExit}>Continua</button>
      </main>
    )
  }

  const q = queue[i]
  const reverse = q.level === 'reverse'
  const expected = reverse ? q.name : q.capital
  const given = q.level === 'medium' ? answer.map((t) => q.tiles[t]).join('') : answer
  const done = result !== null

  function submit(e) {
    e.preventDefault()
    if (!done) {
      if (!normalize(given)) return
      const ok = normalize(given) === normalize(expected)
      setResult(ok)
      if (ok) setScore((s) => s + 1)
    } else {
      const next = result ? queue : [...queue, { ...q, isNew: false }]
      if (i + 1 === next.length) onFinish()
      setQueue(next)
      setI(i + 1)
      setAnswer(emptyFor(next[i + 1]))
      setResult(null)
    }
  }

  return (
    <form className="lesson" onSubmit={submit}>
      <header className="top">
        <button type="button" className="close" onClick={onExit} aria-label="Esci">✕</button>
        <div className="progress"><div style={{ width: `${(score / questions.length) * 100}%` }} /></div>
        {isTest && <span className="lives" aria-label="Vite rimaste">❤️ {TEST_LIVES - mistakes - (result === false ? 1 : 0)}</span>}
      </header>

      <section className="question" key={i}>
        <h2>{reverse ? (path.reverse ?? 'Di quale paese è la capitale?') : (path.question ?? 'Qual è la capitale?')}</h2>
        {q.isNew && <p className="tip"><span className="badge">Nuovo</span> La risposta è <strong>{q.capital}</strong></p>}
        <div className="country">
          {/* la bandiera è decorativa (il nome è nel fumetto); al contrario la si nasconde, darebbe la risposta */}
          {reverse
            ? <span className="landmark" aria-hidden="true">🏛️</span>
            : <img src={`https://flagcdn.com/w320/${q.code}.png`} srcSet={`https://flagcdn.com/w640/${q.code}.png 2x`} alt="" />}
          <span className="bubble">{reverse ? q.capital : q.name}</span>
        </div>

        {q.options && (
          <div className="options">
            {q.options.map((o) => (
              <button type="button" key={o} disabled={done} onClick={() => setAnswer(o)}
                className={`card option ${answer === o ? 'selected' : ''} ${done && o === expected ? 'right' : ''} ${done && answer === o && !result ? 'wrong' : ''}`}>
                {o}
              </button>
            ))}
          </div>
        )}

        {q.level === 'medium' && (
          <>
            <div className="answer-line">
              {answer.map((t, k) => (
                <button type="button" key={k} className="card tile" disabled={done} onClick={() => setAnswer(answer.filter((x) => x !== t))}>{q.tiles[t]}</button>
              ))}
            </div>
            <div className="bank">
              {q.tiles.map((s, t) => (
                <button type="button" key={t} className={`card tile ${answer.includes(t) ? 'used' : ''}`} disabled={done || answer.includes(t)} onClick={() => setAnswer([...answer, t])}>{s}</button>
              ))}
            </div>
          </>
        )}

        {q.level === 'hard' && (
          <input className="card text" value={answer} onChange={(e) => setAnswer(e.target.value)} readOnly={done}
            placeholder="Scrivi la risposta…" aria-label="Risposta" autoFocus autoComplete="off" spellCheck={false} />
        )}
      </section>

      <footer className={`footer ${done ? (result ? 'ok' : 'ko') : ''}`}>
        <div className="footer-inner">
          {done && (
            <div className="feedback" role="status">
              <Avatar a={avatar} mood={result ? 'felice' : 'triste'} />
              <span>
                <strong>{result ? 'Ottimo! 🎉' : 'Risposta corretta:'}</strong>
                {!result && <span>{expected}</span>}
              </span>
            </div>
          )}
          <button className={`btn ${done && !result ? 'red' : 'green'}`} disabled={!done && !normalize(given)}>
            {done ? 'Continua' : 'Verifica'}
          </button>
        </div>
      </footer>
    </form>
  )
}
