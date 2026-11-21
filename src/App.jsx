import { useEffect, useState } from 'react'
import { PATHS } from './data'
import { XP_PER_LESSON, finishLesson, makeLesson, nodesOf, normalize, streakOn, today, unitDone } from './game'

const STEP_UI = {
  easy: { icon: '🎯', label: 'Scelta multipla' },
  medium: { icon: '🧩', label: 'Sillabe' },
  hard: { icon: '✍️', label: 'Scrittura' },
  review: { icon: '🏆', label: 'Ripasso' },
}
const KEY = 'capitali-progress'
const EMPTY = { done: [], xp: 0, streak: 0, lastDay: null, last: null }

function load() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return EMPTY
  }
}

export default function App() {
  const [progress, setProgress] = useState(load)
  const [pathId, setPathId] = useState(null)
  const [lesson, setLesson] = useState(null)
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  const start = (path, node) => {
    setPathId(path.id) // uscendo dalla lezione si torna al percorso
    setLesson({ path, node, questions: makeLesson(path, node), id: Date.now() })
  }

  if (lesson) {
    const finish = () => setProgress((p) => finishLesson(p, lesson.path.id, lesson.node.id, today()))
    return <Lesson key={lesson.id} {...lesson} onFinish={finish} onExit={() => setLesson(null)} />
  }
  const path = PATHS.find((p) => p.id === pathId)
  if (path) return <PathView path={path} done={progress.done} onStart={(n) => start(path, n)} onBack={() => setPathId(null)} />
  return <Home progress={progress} onOpen={setPathId} onStart={start} />
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
      </header>
      <h1>🌍 Capitali</h1>

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
        const open = !p.unlockedBy || unitDone(p.unlockedBy, done)
        const nodes = nodesOf(p)
        const pct = (nodes.filter((n) => done.includes(n.id)).length / nodes.length) * 100
        const learned = count(p.units.filter((u) => unitDone(`${p.id}.${u.id}`, done)))
        const [reqPath, reqUnit] = p.unlockedBy?.split('.') ?? []
        const req = PATHS.find((x) => x.id === reqPath)?.units.find((u) => u.id === reqUnit)
        return (
          <button key={p.id} className={`card path-card ${p.unlockedBy ? 'sub' : ''}`} disabled={!open} onClick={() => onOpen(p.id)}>
            <span className="icon">{open ? p.icon : '🔒'}</span>
            <span className="info">
              <strong>{p.title}</strong>
              {open ? (
                <span className="meter">
                  <span className="progress"><span style={{ width: `${pct}%` }} /></span>
                  <small>{learned}/{count(p.units)}</small>
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

function PathView({ path, done, onStart, onBack }) {
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
          <h2>
            <small>Unità {u + 1}</small>
            {unit.title}
            <span>{unit.countries.map((c) => c.name).join(', ')}</span>
          </h2>
          <div className="nodes">
            {nodes.filter((n) => n.u === u).map((n) => {
              const k = nodes.indexOf(n)
              const state = done.includes(n.id) ? 'done' : k === current ? 'current' : 'locked'
              const { icon, label } = STEP_UI[n.type]
              return (
                <button key={n.id} type="button" className={`node ${state}`} style={{ '--k': k }}
                  disabled={state === 'locked'} onClick={() => onStart(n)}
                  aria-label={`${label}${state === 'done' ? ', completata' : state === 'locked' ? ', bloccata' : ''}`}>
                  {icon}
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

function Lesson({ path, questions, onFinish, onExit }) {
  const [queue, setQueue] = useState(questions) // le domande sbagliate si ripetono in fondo
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState(emptyFor(questions[0]))
  const [result, setResult] = useState(null) // null = non ancora verificato, true/false = esito
  const [score, setScore] = useState(0)

  if (i === queue.length) {
    return (
      <main className="done">
        <div className="trophy">🏆</div>
        <h1>Lezione completata!</h1>
        <div className="row">
          <div className="card score"><small>XP</small><strong>+{XP_PER_LESSON}</strong></div>
          <div className="card score"><small>Precisione</small><strong>{Math.round((100 * questions.length) / queue.length)}%</strong></div>
        </div>
        <button className="btn green" onClick={onExit}>Continua</button>
      </main>
    )
  }

  const q = queue[i]
  const given = q.level === 'medium' ? answer.map((t) => q.tiles[t]).join('') : answer
  const done = result !== null

  function submit(e) {
    e.preventDefault()
    if (!done) {
      if (!normalize(given)) return
      const ok = normalize(given) === normalize(q.capital)
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
      </header>

      <section className="question" key={i}>
        <h2>{path.question ?? 'Qual è la capitale?'}</h2>
        {q.isNew && <p className="tip"><span className="badge">Nuovo</span> La risposta è <strong>{q.capital}</strong></p>}
        <div className="country">
          {/* decorativa: il nome è già nel fumetto (e per le regioni è il tricolore) */}
          <img src={`https://flagcdn.com/w320/${q.code}.png`} srcSet={`https://flagcdn.com/w640/${q.code}.png 2x`} alt="" />
          <span className="bubble">{q.name}</span>
        </div>

        {q.level === 'easy' && (
          <div className="options">
            {q.options.map((o) => (
              <button type="button" key={o} disabled={done} onClick={() => setAnswer(o)}
                className={`card option ${answer === o ? 'selected' : ''} ${done && o === q.capital ? 'right' : ''} ${done && answer === o && !result ? 'wrong' : ''}`}>
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
              <strong>{result ? 'Ottimo! 🎉' : 'Risposta corretta:'}</strong>
              {!result && <span>{q.capital}</span>}
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
