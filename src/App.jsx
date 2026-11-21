import { useState } from 'react'
import { COUNTRIES } from './data'
import { makeLesson, normalize } from './game'

const LEVELS = [
  { id: 'easy', title: 'Facile', desc: 'Scegli tra 4 risposte', icon: '🎯' },
  { id: 'medium', title: 'Intermedio', desc: 'Componi il nome con le sillabe', icon: '🧩' },
  { id: 'hard', title: 'Difficile', desc: 'Scrivi il nome a mano', icon: '✍️' },
]
const LESSON_LENGTH = 10

export default function App() {
  const [lesson, setLesson] = useState(null)
  const start = (level) => setLesson({ level, questions: makeLesson(level, COUNTRIES, LESSON_LENGTH), id: Date.now() })

  if (!lesson) {
    return (
      <main className="menu">
        <h1>🌍 Capitali</h1>
        <p className="subtitle">Scegli un livello</p>
        {LEVELS.map((l) => (
          <button key={l.id} className="card level" onClick={() => start(l.id)}>
            <span className="icon">{l.icon}</span>
            <span><strong>{l.title}</strong><small>{l.desc}</small></span>
          </button>
        ))}
      </main>
    )
  }
  return <Lesson key={lesson.id} {...lesson} onExit={() => setLesson(null)} onRestart={() => start(lesson.level)} />
}

function Lesson({ level, questions, onExit, onRestart }) {
  const empty = level === 'medium' ? [] : ''
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState(empty)
  const [result, setResult] = useState(null) // null = non ancora verificato, true/false = esito
  const [score, setScore] = useState(0)

  if (i === questions.length) {
    return (
      <main className="done">
        <div className="trophy">🏆</div>
        <h1>Lezione completata!</h1>
        <div className="card score"><small>Risposte corrette</small><strong>{score}/{questions.length}</strong></div>
        <button className="btn green" onClick={onRestart}>Ripeti</button>
        <button className="btn ghost" onClick={onExit}>Menu</button>
      </main>
    )
  }

  const q = questions[i]
  const given = level === 'medium' ? answer.map((t) => q.tiles[t]).join('') : answer
  const done = result !== null

  function submit(e) {
    e.preventDefault()
    if (!done) {
      if (!normalize(given)) return
      const ok = normalize(given) === normalize(q.capital)
      setResult(ok)
      if (ok) setScore((s) => s + 1)
    } else {
      setI(i + 1)
      setAnswer(empty)
      setResult(null)
    }
  }

  return (
    <form className="lesson" onSubmit={submit}>
      <header className="top">
        <button type="button" className="close" onClick={onExit} aria-label="Esci">✕</button>
        <div className="progress"><div style={{ width: `${((i + done) / questions.length) * 100}%` }} /></div>
      </header>

      <section className="question" key={i}>
        <h2>Qual è la capitale?</h2>
        <div className="country">
          <img src={`https://flagcdn.com/w320/${q.code}.png`} srcSet={`https://flagcdn.com/w640/${q.code}.png 2x`} alt={`Bandiera: ${q.name}`} />
          <span className="bubble">{q.name}</span>
        </div>

        {level === 'easy' && (
          <div className="options">
            {q.options.map((o) => (
              <button type="button" key={o} disabled={done} onClick={() => setAnswer(o)}
                className={`card option ${answer === o ? 'selected' : ''} ${done && o === q.capital ? 'right' : ''} ${done && answer === o && !result ? 'wrong' : ''}`}>
                {o}
              </button>
            ))}
          </div>
        )}

        {level === 'medium' && (
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

        {level === 'hard' && (
          <input className="card text" value={answer} onChange={(e) => setAnswer(e.target.value)} readOnly={done}
            placeholder="Scrivi la capitale…" aria-label="Capitale" autoFocus autoComplete="off" spellCheck={false} />
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
