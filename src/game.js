const V = 'aeiouyàáâäèéêëìíîïòóôöùúûüăå'
// consonanti* vocali+ poi: le consonanti finali, oppure una consonante se ne segue un'altra (Lon-dra, Stoc-col-ma)
// ponytail: sillabazione euristica, non segue tutte le regole italiane (es. s impura)
const SYLLABLE = new RegExp(`[^${V}]*[${V}]+(?:[^${V}]*$|[^${V}](?=[^${V}]))?`, 'g')

export const syllables = (name) =>
  name.toLowerCase().split(' ').flatMap((w) => w.match(SYLLABLE) ?? [w])

// ignora maiuscole, accenti, spazi e apostrofi: "l avana" == "L'Avana"
export const normalize = (s) => s.normalize('NFD').replace(/[^a-z]/gi, '').toLowerCase()

export const shuffle = (arr) =>
  arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v)

const sample = (arr, n) => shuffle(arr).slice(0, n)

export function makeQuestion(country, level, all) {
  const others = sample(all.filter((c) => c !== country), 3)
  if (level === 'easy') return { ...country, level, options: shuffle([country, ...others].map((c) => c.capital)) }
  if (level === 'medium') {
    const syl = syllables(country.capital)
    const extra = [...new Set(others.flatMap((c) => syllables(c.capital)))].filter((s) => !syl.includes(s))
    return { ...country, level, tiles: shuffle([...syl, ...extra.slice(0, 4)]) }
  }
  return { ...country, level }
}

// --- percorso ---

// i passi di ogni unità: si riconosce, si compone, si scrive, si ripassa
export const STEPS = ['easy', 'easy', 'medium', 'hard', 'review']
const MIXED = ['easy', 'medium', 'hard']
export const LESSON_LENGTH = 10
export const XP_PER_LESSON = 10

export const nodesOf = (path) =>
  path.units.flatMap((unit, u) => STEPS.map((type, s) => ({ id: `${path.id}.${unit.id}.${s}`, type, u, s })))

// ref = "percorso.unità"; i passi si sbloccano in ordine, quindi basta l'ultimo
export const unitDone = (ref, done) => done.includes(`${ref}.${STEPS.length - 1}`)

// n elementi ripetendo il gruppo se è più piccolo di n, mai lo stesso due volte di fila
function pick(arr, n) {
  const out = []
  while (out.length < n) {
    const s = shuffle(arr)
    if (s.length > 1 && s[0] === out.at(-1)) s.push(s.shift())
    out.push(...s)
  }
  return out.slice(0, n)
}

export function makeLesson(path, { u, s, type }, n = LESSON_LENGTH) {
  const all = path.units.flatMap((x) => x.countries) // risposte sbagliate plausibili: dallo stesso percorso
  const unit = path.units[u].countries
  // il ripasso aggiunge qualche paese delle unità precedenti
  const pool = type === 'review' ? [...unit, ...sample(path.units.slice(0, u).flatMap((x) => x.countries), 4)] : unit
  const seen = new Set()
  return pick(pool, n).map((c, i) => {
    const q = makeQuestion(c, type === 'review' ? MIXED[i % MIXED.length] : type, all)
    q.isNew = s === 0 && !seen.has(c) // primo passo: alla prima apparizione si mostra la risposta
    seen.add(c)
    return q
  })
}

// --- progressi ---

// data locale YYYY-MM-DD (il locale svedese usa proprio questo formato)
export const today = () => new Date().toLocaleDateString('sv')
const dayBefore = (d) => new Date(Date.parse(d) - 864e5).toISOString().slice(0, 10)

// la serie vale ancora se l'ultima lezione è di oggi o di ieri
export const streakOn = (p, d) => (p.lastDay === d || p.lastDay === dayBefore(d) ? p.streak : 0)

export const finishLesson = (p, pathId, nodeId, d) => ({
  done: p.done.includes(nodeId) ? p.done : [...p.done, nodeId],
  xp: p.xp + XP_PER_LESSON,
  streak: streakOn(p, d) + (p.lastDay === d ? 0 : 1),
  lastDay: d,
  last: pathId,
})
