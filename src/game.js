const V = 'aeiouyàáâäèéêëìíîïòóôöùúûüăå'
// consonanti* vocali+ poi: le consonanti finali, oppure una consonante se ne segue un'altra (Lon-dra, Stoc-col-ma)
// ponytail: sillabazione euristica, non segue tutte le regole italiane (es. s impura)
const SYLLABLE = new RegExp(`[^${V}]*[${V}]+(?:[^${V}]*$|[^${V}](?=[^${V}]))?`, 'g')

export const syllables = (name) =>
  name.toLowerCase().split(/[ -]/).flatMap((w) => w.match(SYLLABLE) ?? [w])

// ignora maiuscole, accenti, spazi e apostrofi: "l avana" == "L'Avana"
export const normalize = (s) => s.normalize('NFD').replace(/[^a-z]/gi, '').toLowerCase()

export const shuffle = (arr) =>
  arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v)

const sample = (arr, n) => shuffle(arr).slice(0, n)

export function makeQuestion(country, level, all) {
  const others = sample(all.filter((c) => c !== country), 3)
  if (level === 'easy') return { ...country, level, options: shuffle([country, ...others].map((c) => c.capital)) }
  // al contrario: data la capitale, si sceglie il paese
  if (level === 'reverse') return { ...country, level, options: shuffle([country, ...others].map((c) => c.name)) }
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
const MIXED = ['easy', 'medium', 'hard', 'reverse']
export const LESSON_LENGTH = 10
export const XP_PER_LESSON = 10
export const PARTS = 3 // lezioni per passo (i trattini intorno al cerchio); il ripasso ne ha una
const OLD = 3 // capitali delle unità precedenti nelle lezioni dopo la prima

export const nodesOf = (path) =>
  path.units.flatMap((unit, u) => STEPS.map((type, s) => ({ id: `${path.id}.${unit.id}.${s}`, type, u, s, parts: type === 'review' ? 1 : PARTS })))

// la lezione a cui è arrivato il passo; un passo completato si ripete dall'ultima
export const partOf = (p, node) => (p.done.includes(node.id) ? node.parts - 1 : p.parts?.[node.id] ?? 0)

// ref = "percorso.unità"; i passi si sbloccano in ordine, quindi basta l'ultimo
export const unitDone = (ref, done) => done.includes(`${ref}.${STEPS.length - 1}`)

// città imparate: quelle delle unità completate
export const learned = (path, done) =>
  path.units.filter((u) => unitDone(`${path.id}.${u.id}`, done)).reduce((n, u) => n + u.countries.length, 0)

export const isOpen = (path, done) => !path.unlockedBy || unitDone(path.unlockedBy, done)

// test per saltare all'unità u: domande sulle unità precedenti, se lo superi le completa tutte
export const jumpTest = (path, u) => ({ type: 'test', u, s: -1, clears: nodesOf(path).filter((n) => n.u < u).map((n) => n.id) })

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

export function makeLesson(path, { u, s, type }, part = 0, n = LESSON_LENGTH) {
  const all = path.units.flatMap((x) => x.countries) // risposte sbagliate plausibili: dallo stesso percorso
  const unit = path.units[u].countries
  const before = path.units.slice(0, u).flatMap((x) => x.countries)
  // dopo la prima lezione e nel ripasso tornano alcuni paesi delle unità precedenti, il test le copre tutte
  const pool = type === 'test' ? before : type === 'review' ? [...unit, ...sample(before, 4)] : [...unit, ...(part ? sample(before, OLD) : [])]
  const mixed = type === 'review' || type === 'test'
  const seen = new Set()
  return pick(pool, n).map((c, i) => {
    const q = makeQuestion(c, mixed ? MIXED[i % MIXED.length] : type, all)
    q.isNew = s === 0 && part === 0 && !seen.has(c) // prima lezione: alla prima apparizione si mostra la risposta
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

// node: il passo appena fatto, completato all'ultima lezione; un test completa tutte le unità saltate (node.clears)
export function finishLesson(p, pathId, node, d) {
  const streak = streakOn(p, d) + (p.lastDay === d ? 0 : 1)
  const part = partOf(p, node) + 1
  const ids = node.clears ?? (part >= node.parts ? [node.id] : [])
  const parts = { ...p.parts, [node.id]: part }
  if (ids.length) delete parts[node.id]
  return {
    ...p, // nome, avatar, ...
    done: [...new Set([...p.done, ...ids])],
    parts,
    xp: p.xp + XP_PER_LESSON,
    streak,
    best: Math.max(p.best ?? 0, streak),
    lastDay: d,
    last: pathId,
  }
}
