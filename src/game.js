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
  if (level === 'easy') return { ...country, options: shuffle([country, ...others].map((c) => c.capital)) }
  if (level === 'medium') {
    const syl = syllables(country.capital)
    const extra = [...new Set(others.flatMap((c) => syllables(c.capital)))].filter((s) => !syl.includes(s))
    return { ...country, tiles: shuffle([...syl, ...extra.slice(0, 4)]) }
  }
  return { ...country }
}

export const makeLesson = (level, all, n) => sample(all, n).map((c) => makeQuestion(c, level, all))
