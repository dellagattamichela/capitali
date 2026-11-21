// Avatar come dati: niente JSX, così è testabile con node --test.
// Ogni opzione ha dei livelli (back = dietro la testa, front = davanti) fatti di forme [colore, percorso SVG, spessore?].
// Il colore è un token risolto rispetto al colore della parte: base, shade (più scuro), light (più chiaro),
// faint (semitrasparente, per barba corta e rasature), cheek (guance), ink (tratti del viso), oppure un #esadecimale.
// Con lo spessore la forma è una linea invece che un riempimento.
// Un percorso può essere una funzione dell'altezza dei capelli: così corona e cuffie si appoggiano sopra.
import { PATHS } from './data.js'
import { unitDone } from './game.js'

export const INK = '#1f1f1f'
const HEAD_TOP = 19 // testa: ellisse centrata in (50, 44), raggi 26 x 25

export function paint(token, color) {
  if (token === 'base') return color
  if (token === 'shade') return `color-mix(in srgb, ${color}, #000 22%)`
  if (token === 'light') return `color-mix(in srgb, ${color}, #fff 35%)`
  if (token === 'faint') return `color-mix(in srgb, ${color} 35%, transparent)`
  if (token === 'cheek') return `color-mix(in srgb, ${color}, #ff4d6d 40%)`
  if (token === 'ink') return INK
  return token
}

const circle = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`
const ellipse = (cx, cy, rx, ry) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`
const box = (x, y, w, h, r) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`
const FULL = 'M-20 -20 H120 V120 H-20 Z'
const below = (y) => `M-20 ${y} H120 V120 H-20 Z` // ritaglio dei capelli: visibili solo sotto la tesa

// inquadrature (viewBox): intera, testa e spalle per le misure piccole, e zoom per le anteprime dell'editor
export const VIEWS = { full: '-6 -12 112 112', head: '10 -2 80 80', hat: '6 -12 88 88', face: '25 25 50 50', chin: '20 32 60 60', top: '18 40 64 64' }
// sagoma del busto con lo scollo: le maglie sono ritagliate qui dentro
export const TORSO = 'M15 100 C15 86 27 78 40 77 Q50 85 60 77 C73 78 85 86 85 100 Z'

const SKIN = { 'molto chiara': '#ffdbac', chiara: '#f1c27d', media: '#e0ac69', olivastra: '#c68642', scura: '#8d5524', 'molto scura': '#694126' }
const HAIR_COLOR = { neri: '#2c1b10', castani: '#6b3e1f', biondi: '#e8b84a', rossi: '#c0441d', grigi: '#b8b8b8', blu: '#1cb0f6', viola: '#ce82ff' }
const SHIRT = { verde: '#58cc02', azzurra: '#1cb0f6', rossa: '#ff4b4b', gialla: '#ffc800', viola: '#ce82ff', arancione: '#ff9600', grigia: '#4b4b4b' }

// --- viso ---

const highlights = [['#fff', circle(41.2, 44.8, 1.1)], ['#fff', circle(61.2, 44.8, 1.1)]]
const EYES = {
  tondi: [['ink', circle(40, 46, 3.3)], ['ink', circle(60, 46, 3.3)], ...highlights],
  grandi: [
    ['#fff', ellipse(40, 46, 5, 5.6)], ['#fff', ellipse(60, 46, 5, 5.6)],
    ['ink', ellipse(40, 46, 5, 5.6), 1.2], ['ink', ellipse(60, 46, 5, 5.6), 1.2],
    ['ink', circle(40.6, 46.8, 3.2)], ['ink', circle(60.6, 46.8, 3.2)],
    ['#fff', circle(41.8, 45.4, 1.2)], ['#fff', circle(61.8, 45.4, 1.2)],
  ],
  mandorla: [['ink', 'M35 46 Q40 41 45 46 Q40 49.5 35 46 Z'], ['ink', 'M55 46 Q60 41 65 46 Q60 49.5 55 46 Z'], ['#fff', circle(41.4, 45, 0.9)], ['#fff', circle(61.4, 45, 0.9)]],
  assonnati: [
    ['ink', 'M36.5 45.5 A3.5 3.5 0 0 0 43.5 45.5 Z'], ['ink', 'M56.5 45.5 A3.5 3.5 0 0 0 63.5 45.5 Z'],
    ['ink', 'M35.5 45.5 H44.5 M55.5 45.5 H64.5', 1.8], ['#fff', circle(41.4, 47, 0.8)], ['#fff', circle(61.4, 47, 0.8)],
  ],
  occhiolino: [['ink', circle(40, 46, 3.3)], ['#fff', circle(41.2, 44.8, 1.1)], ['ink', 'M56 46.5 Q60 42.5 64 46.5', 2.8]],
  felici: [['ink', 'M36 47.5 Q40 42.5 44 47.5', 3], ['ink', 'M56 47.5 Q60 42.5 64 47.5', 3]],
}

const BROWS = {
  nessuna: [],
  sottili: [['shade', 'M35 38.5 Q40 36 45 38', 2.4], ['shade', 'M55 38 Q60 36 65 38.5', 2.4]],
  folte: [['shade', 'M34 39 Q40 33.5 46 37.5 L45.5 39.8 Q40 36.8 34.5 40.8 Z'], ['shade', 'M66 39 Q60 33.5 54 37.5 L54.5 39.8 Q60 36.8 65.5 40.8 Z']],
  arcuate: [['shade', 'M35 39 Q40 33.5 45 37.5', 2.6], ['shade', 'M55 37.5 Q60 33.5 65 39', 2.6]],
  dritte: [['shade', 'M35 37.5 H45', 2.8], ['shade', 'M55 37.5 H65', 2.8]],
  preoccupate: { hidden: true, front: [['shade', 'M35 39 Q40 38 45 35.5', 2.6], ['shade', 'M55 35.5 Q60 38 65 39', 2.6]] },
}

const NOSES = {
  nessuno: [],
  puntino: [['shade', ellipse(50, 53, 2.2, 1.6)]],
  tondo: [['shade', 'M46.5 54 Q50 58 53.5 54', 1.8]],
  'a punta': [['shade', 'M50.5 48 L47.5 55 Q49.5 56 52 55.3', 1.8]],
}

const MOUTHS = {
  sorriso: [['ink', 'M44 58 Q50 63.5 56 58', 2.8]],
  risata: [['ink', 'M43 57 Q50 67.5 57 57 Q50 59 43 57 Z'], ['#ff8fa3', 'M46.5 62.8 Q50 60.3 53.5 62.8 Q50 65.3 46.5 62.8 Z']],
  sorrisetto: [['ink', 'M45 59.5 Q51 61.5 56 57', 2.8]],
  neutra: [['ink', 'M46 59.5 H54', 2.8]],
  sorpresa: [['ink', ellipse(50, 60, 2.8, 3.5)]],
  triste: { hidden: true, front: [['ink', 'M44 62 Q50 56.5 56 62', 2.8]] },
}

const DETAILS = {
  guance: [['cheek', circle(33, 55, 4.2)], ['cheek', circle(67, 55, 4.2)]],
  lentiggini: [[32, 51], [35, 53], [31.5, 54.5], [68, 51], [65, 53], [68.5, 54.5]].map(([x, y]) => ['shade', circle(x, y, 0.9)]),
  nessuno: [],
}

// --- capelli (top = punto più alto, dove si appoggiano corona e cuffie) ---

const CAP = 'M23 47 C21 22 36 14 50 14 C64 14 79 22 77 47 C73 36 62 31 50 31 C38 31 27 36 23 47 Z'
const SHINE = ['light', 'M31 31 Q35 22 44 19', 2.6]
// ricci: tanti cerchi di misure diverse fanno un contorno irregolare; dietro più scuri (bordo), davanti il colore
// pieno, e sopra dei piccoli riccioli disegnati per la texture
const r1 = (v) => Math.round(v * 10) / 10
// n cerchi lungo un arco d'ellisse [cx, cy, rx, ry], angoli in gradi (180 = sinistra, 270 = in alto, 360 = destra)
const ring = (token, [cx, cy, rx, ry], [from, to], n, r) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((from + ((to - from) * i) / (n - 1)) * Math.PI) / 180
    return [token, circle(r1(cx + rx * Math.cos(a)), r1(cy + ry * Math.sin(a)), i % 2 ? r1(r * 0.8) : r)]
  })
// ogni ricciolo: tratto scuro + tratto chiaro accanto, così si vede su qualsiasi colore (dal nero al biondo)
const curls = (pts) => pts.flatMap(([x, y]) => [
  ['shade', `M${x} ${y} a2.2 2.2 0 1 1 3.4 1.6`, 1.1],
  ['light', `M${x + 0.6} ${y + 0.7} a2.2 2.2 0 1 1 3.4 1.6`, 0.7],
])
const circles = (token, list) => list.map(([x, y, r]) => [token, circle(x, y, r)])
// attaccatura a riccioli piccoli: alta al centro, scende solo alle tempie (non copre le sopracciglia)
const HAIRLINE = [[27, 39], [30, 34], [34, 30.5], [39, 29], [44.5, 28.5], [50, 28.5], [55.5, 28.5], [61, 29], [66, 30.5], [70, 34], [73, 39]]
  .map(([x, y], i) => ['base', circle(x, y, i % 2 ? 3.6 : 4.5)])
const CURLY_TOP = [['base', ellipse(50, 24, 23, 8)], ...HAIRLINE, ...curls([[35, 22], [45, 17], [55, 18], [64, 22], [30, 28], [41, 24], [52, 23], [67, 28]])]
const puff = (cx, cy, rx, ry, r) => [...ring('shade', [cx, cy, rx, ry], [0, 330], 12, r), ['base', ellipse(cx, cy, rx - 1, ry - 1)]]
// capelli lunghi: davanti un pezzo unico che incornicia il viso, copre le orecchie e finisce con punte arrotondate
// sulle spalle; dietro (più scuro) si vede solo dietro il collo e ai lati delle spalle
const LOCKS = 'C17 62 16 78 20 89 Q25.5 93 31 89 C30 77 29 64 30 54' // ciocca sinistra, dall'esterno al viso
const LOCKS_R = 'C71 64 70 77 69 89 Q74.5 93 80 89 C84 78 83 62 82 44' // ciocca destra, dal viso all'esterno
const BACK_LONG = ['shade', 'M50 15 C29 15 16 25 16 46 C16 64 14 78 16 87 Q50 95 84 87 C86 78 84 64 84 46 C84 25 71 15 50 15 Z']
const PART = ['shade', 'M50 17.5 V25.5', 1.2]
const braid = [[70, 88], [72, 80], [74, 72], [75.5, 64], [77, 56]].flatMap(([x, y]) => [['base', ellipse(x, y, 5.6, 5)], ['shade', ellipse(x, y, 5.6, 5), 1]])
const HAIR = {
  nessuno: { top: HEAD_TOP },
  corti: { top: 14, front: [['base', CAP], SHINE] },
  spettinati: { top: 3, front: [['base', 'M23 47 C21 30 27 22 33 19 L30 7 L40 14 L45 3 L52 13 L60 5 L62 16 C71 20 79 29 77 47 C73 36 62 31 50 31 C38 31 27 36 23 47 Z']] },
  cresta: { top: 2, front: [['faint', CAP], ['base', 'M43 33 C41 20 44 8 50 2 C56 8 59 20 57 33 Q50 30 43 33 Z']] },
  rasati: { top: 12, front: [['faint', CAP], ['base', 'M26 38 C27 19 46 11 62 14 C74 16 80 26 77 39 C67 30 50 26 26 38 Z']] },
  chignon: { top: 2, back: [['base', circle(50, 11, 9)]], front: [['base', CAP], SHINE] },
  coda: { top: 14, back: [['shade', 'M68 24 C90 22 94 52 84 74 C82 60 78 46 68 40 Z']], front: [['base', CAP], SHINE] },
  caschetto: {
    top: 13,
    back: [['shade', 'M50 13 C30 13 16 23 16 44 C16 56 16 64 19 70 Q50 76 81 70 C84 64 84 56 84 44 C84 23 70 13 50 13 Z']],
    front: [['base', 'M50 13 C34 13 18 21 18 44 C18 54 18 62 21 68 Q26 72 31 68 C30 62 29 58 30 54 C29 46 29 39 30 35 Q50 37 70 35 C71 39 71 46 70 54 C71 58 70 62 69 68 Q74 72 79 68 C82 62 82 54 82 44 C82 21 66 13 50 13 Z'], SHINE],
  },
  lunghi: {
    top: 15,
    back: [BACK_LONG],
    front: [['base', `M50 17 C38 13 18 20 18 44 ${LOCKS} C29 39 39 28 50 27 C61 28 71 39 70 54 ${LOCKS_R} C82 20 62 13 50 17 Z`], PART, SHINE],
  },
  'lunghi di lato': {
    top: 15,
    back: [BACK_LONG],
    front: [['base', `M36 18 C26 20 18 30 18 44 ${LOCKS} C29 45 31 39 34 35 C42 33 56 29 70 40 C71 45 70 50 70 54 ${LOCKS_R} C82 22 60 12 36 18 Z`], SHINE],
  },
  mossi: {
    top: 15,
    back: [['shade', 'M50 15 C29 15 15 25 16 44 C13 56 19 66 15 76 C13 84 18 90 24 90 Q50 96 76 90 C82 90 87 84 85 76 C81 66 87 56 84 44 C85 25 71 15 50 15 Z']],
    front: [
      ['base', 'M50 17 C38 13 18 20 19 42 C16 50 22 56 18 64 C15 72 22 78 19 86 Q24 94 31 88 C27 80 33 74 29 66 C27 60 31 56 30 52 C29 39 39 28 50 27 C61 28 71 39 70 52 C69 56 73 60 71 66 C67 74 73 80 69 88 Q76 94 81 86 C78 78 85 72 82 64 C78 56 84 50 81 42 C82 20 62 13 50 17 Z'],
      PART, SHINE,
    ],
  },
  frangia: {
    top: 15,
    back: [BACK_LONG],
    front: [
      ['base', `M50 15 C34 15 18 22 18 44 ${LOCKS} C29 46 29 39 31 34 Q50 37 69 34 C71 39 71 46 70 54 ${LOCKS_R} C82 22 66 15 50 15 Z`],
      ['shade', 'M41 27 L40 34.5 M50 28 V35.5 M59 27 L60 34.5', 1], SHINE,
    ],
  },
  treccia: {
    top: 14,
    front: [['base', CAP], SHINE, ['shade', circle(70, 93.5, 2.2)], ['base', 'M67 95 Q70 101 73 95 Z'], ...braid],
  },
  trecce: {
    top: 14,
    back: [[19, 54], [19.5, 63], [20, 72], [81, 54], [80.5, 63], [80, 72]].map(([x, y]) => ['shade', circle(x, y, 5.5)]),
    front: [['base', CAP], SHINE],
  },
  ricci: {
    top: 8,
    back: [...ring('shade', [50, 38, 27, 23], [165, 375], 13, 7.5), ['shade', ellipse(50, 36, 26, 21)]],
    front: [...ring('base', [50, 38, 24, 20.5], [190, 350], 9, 7), ...CURLY_TOP],
  },
  'ricci rasati': {
    top: 10,
    front: [
      ['faint', CAP], ...ring('shade', [50, 27, 18, 11], [180, 360], 9, 6), ['base', ellipse(50, 26, 17, 8)],
      ...ring('base', [50, 27, 15.5, 9], [185, 355], 8, 5), ...curls([[40, 20], [50, 17], [58, 21], [45, 25]]),
    ],
  },
  afro: {
    top: -3,
    back: [...ring('shade', [50, 35, 33, 29], [140, 400], 17, 9.5), ['shade', ellipse(50, 36, 32, 27)]],
    front: [...ring('base', [50, 36, 29, 27], [175, 365], 13, 8), ...CURLY_TOP, ...curls([[22, 30], [74, 28], [18, 40], [78, 41], [28, 14], [68, 12], [48, 8]])],
  },
  'afro puff': {
    top: -4,
    back: [...puff(50, 12, 14, 10, 6), ...curls([[42, 8], [51, 5], [46, 13], [56, 12]])],
    front: [['base', CAP], SHINE],
  },
  'due puff': {
    top: 2,
    back: [...puff(30, 15, 9, 8, 5), ...puff(70, 15, 9, 8, 5), ...curls([[26, 12], [31, 16], [66, 12], [71, 16]])],
    front: [['base', CAP], PART],
  },
  boccoli: {
    top: 5,
    back: [...ring('shade', [50, 40, 30, 27], [120, 420], 15, 8), ['shade', ellipse(50, 44, 29, 27)], ...circles('shade', [[20, 62, 7], [80, 62, 7], [23, 72, 7], [77, 72, 7]])],
    // riccioli ai lati, davanti alle orecchie
    front: [
      ...circles('base', [[21, 47, 7], [22, 58, 6], [24, 68, 7], [79, 47, 7], [78, 58, 6], [76, 68, 7]]),
      ...ring('base', [50, 40, 26, 24], [190, 350], 9, 7.5), ...CURLY_TOP, ...curls([[19, 50], [77, 52], [21, 64], [75, 66]]),
    ],
  },
  'ricci lunghi': {
    top: 4,
    back: [
      ...ring('shade', [50, 40, 31, 27], [140, 400], 15, 8.5), ['shade', ellipse(50, 44, 30, 28)],
      ...circles('shade', [[18, 60, 9], [17, 72, 9], [19, 83, 8], [82, 60, 9], [83, 72, 9], [81, 83, 8]]),
    ],
    front: [
      // colonne a zig-zag, non dritte: sembrano boccoli e non palline impilate
      ...circles('base', [[21, 47, 7.5], [19, 57, 7], [22, 66, 7.5], [20, 76, 7], [24, 85, 6], [79, 47, 7.5], [81, 57, 7], [78, 66, 7.5], [80, 76, 7], [76, 85, 6]]),
      ...ring('base', [50, 40, 27, 24.5], [190, 350], 9, 7.5), ...CURLY_TOP, ...curls([[18, 52], [19, 72], [77, 54], [78, 72]]),
    ],
  },
}

const mustache = ['base', 'M41.5 56.5 Q45 52.5 50 55 Q55 52.5 58.5 56.5 Q55 58 50 56.3 Q45 58 41.5 56.5 Z']
const BEARDS = {
  nessuna: [],
  baffi: [mustache],
  pizzetto: [['base', 'M45.5 64 Q50 62.5 54.5 64 Q53.5 71 50 72.5 Q46.5 71 45.5 64 Z']],
  corta: [['faint', 'M24 46 C24 62 35 70 50 70 C65 70 76 62 76 46 C73 56 66 62 58 62.5 Q50 66 42 62.5 C34 62 27 56 24 46 Z']],
  lunga: [['base', 'M24 45 C23 70 36 84 50 86 C64 84 77 70 76 45 C74 57 68 64 60 64 Q50 68 40 64 C32 64 26 57 24 45 Z'], mustache],
}

// --- vestiti: ritagliati nel busto, quindi basta riempire tutto e aggiungere i dettagli ---

const NECKLINE = ['shade', 'M40 77 Q50 85 60 77 L62 77.8 Q50 89 38 77.8 Z']
const TOPS = {
  maglietta: [['base', FULL], NECKLINE],
  felpa: {
    back: [['shade', 'M27 86 C25 68 75 68 73 86 Z']], // cappuccio dietro il collo
    front: [['base', FULL], ['shade', 'M33 93 Q50 90 67 93 L69 100 H31 Z'], ['light', 'M45.5 84 V93', 1.6], ['light', 'M54.5 84 V93', 1.6], NECKLINE],
  },
  camicia: [['base', FULL], ['light', 'M50 86 L40 76 L35.5 83 Z'], ['light', 'M50 86 L60 76 L64.5 83 Z'], ['shade', circle(50, 91, 1.3)], ['shade', circle(50, 97, 1.3)]],
  'a righe': [['base', FULL], ['light', 'M0 85 H100 V89 H0 Z'], ['light', 'M0 94 H100 V98 H0 Z'], NECKLINE],
  giacca: [['base', FULL], ['#ffffff', 'M40 77 Q50 85 60 77 L56 100 H44 Z'], ['shade', 'M40 77 L47 90 L44 100 H38 L36 80 Z'], ['shade', 'M60 77 L53 90 L56 100 H62 L64 80 Z']],
}

// --- accessori: clip = dove restano visibili i capelli; il colore base è quello della maglia ---

const HATS = {
  nessuno: {},
  cappellino: {
    clip: below(37),
    front: [['base', 'M22 37 C21 10 79 10 78 37 Z'], ['shade', 'M22 33 H78 V37.5 H22 Z'], ['shade', 'M50 33 Q86 29 94 38 Q78 42 50 37.5 Z'], ['light', circle(50, 16.5, 2.6)]],
  },
  berretto: {
    clip: below(40),
    front: [['base', 'M21 40 C19 6 81 6 79 40 Z'], ['shade', 'M20 32 H80 Q81 41 77 41 H23 Q19 41 20 32 Z'], ['light', circle(50, 11, 5)]],
  },
  cuffie: {
    front: [
      ['#4b4b4b', (t) => `M19 47 C17 ${t - 13} 83 ${t - 13} 81 47 L76.5 47 C78 ${t - 7} 22 ${t - 7} 23.5 47 Z`],
      ['base', box(15, 38, 11, 18, 4.5)], ['base', box(74, 38, 11, 18, 4.5)], ['shade', box(21, 41, 4, 12, 2)], ['shade', box(75, 41, 4, 12, 2)],
    ],
  },
  esploratore: {
    unlock: { units: 1 },
    clip: below(35),
    front: [['#c8a46a', 'M28 31 C28 9 72 9 72 31 Z'], ['#7a5a2e', 'M28 26 H72 V31 H28 Z'], ['#b08d57', 'M8 34 Q50 24 92 34 Q50 41 8 34 Z']],
  },
  aviatore: {
    unlock: { best: 7 },
    clip: below(62),
    front: [
      ['#8b5a2b', 'M22 52 C19 10 81 10 78 52 L78 62 Q74 67 70 61 L70 45 C66 34 58 30 50 30 C42 30 34 34 30 45 L30 61 Q26 67 22 62 Z'],
      ['#5c3a1e', 'M23 28 H77 V32 H23 Z'],
      ['#7fd1f5', circle(40, 29, 6)], ['#7fd1f5', circle(60, 29, 6)], ['ink', circle(40, 29, 6), 1.6], ['ink', circle(60, 29, 6), 1.6],
    ],
  },
  corona: {
    unlock: { xp: 500 },
    front: [
      ['#ffc800', (t) => `M33 ${t + 7} L32 ${t - 8} L41.5 ${t - 1} L50 ${t - 11} L58.5 ${t - 1} L68 ${t - 8} L67 ${t + 7} Z`],
      ['#e0a800', (t) => `M33 ${t + 3} H67 V${t + 7} H33 Z`],
      ['#ff4b4b', (t) => circle(50, t + 1, 2)],
    ],
  },
}

const arms = ['ink', 'M32.5 45 L24 43 M67.5 45 L76 43', 2]
const GLASSES = {
  nessuno: [],
  tondi: [['ink', circle(40, 46, 7.5), 2], ['ink', circle(60, 46, 7.5), 2], ['ink', 'M47.5 45 Q50 43.5 52.5 45', 2], arms],
  rettangolari: [['ink', box(31, 40.5, 17, 12, 3), 2], ['ink', box(52, 40.5, 17, 12, 3), 2], ['ink', 'M48 45 H52', 2], ['ink', 'M31 45 L24 43 M69 45 L76 43', 2]],
  'da sole': [['#2b2b2b', box(31, 40.5, 17, 11.5, 4)], ['#2b2b2b', box(52, 40.5, 17, 11.5, 4)], ['#fff', 'M34.5 43.5 L37.5 41.8 M55.5 43.5 L58.5 41.8', 1.2], ['ink', 'M48 45 H52', 2], ['ink', 'M31 45 L24 43 M69 45 L76 43', 2]],
}

const EARS = {
  nessuno: [],
  orecchini: [['#ffc800', circle(24, 54, 2)], ['#ffc800', circle(76, 54, 2)]],
  'apparecchio acustico': [['#c9c9c9', 'M21 40 C16 41 16 51 20 53 L21.5 51 C19 49 19 43 22 42 Z'], ['#c9c9c9', 'M79 40 C84 41 84 51 80 53 L78.5 51 C81 49 81 43 78 42 Z']],
}

const BGS = {
  azzurro: '#ddf4ff', verde: '#d7ffb8', rosa: '#ffdfe0', giallo: '#fff4c2', lilla: '#f3e0ff', pesca: '#ffe8cc',
  mappa: {
    unlock: { paths: 1 },
    color: '#cfeaff',
    front: ['M-6 12 Q8 4 18 10 Q24 20 12 26 Q0 28 -6 20 Z', 'M80 6 Q96 2 106 12 L106 30 Q92 28 86 20 Q78 14 80 6 Z', 'M-6 70 Q6 62 14 72 Q16 86 4 92 L-6 92 Z', 'M88 64 Q100 60 106 66 L106 86 Q96 84 90 76 Z'].map((d) => ['#a6dc7a', d]),
  },
}

// stringa = colore, array = sole forme davanti, oggetto = già completo
const opts = (table) =>
  Object.fromEntries(Object.entries(table).map(([k, o]) => [k, typeof o === 'string' ? { color: o } : Array.isArray(o) ? { front: o } : o]))

// paint: di che colore sono i token base/shade/... di questa parte
export const SLOTS = {
  skin: { label: 'Pelle', options: opts(SKIN) },
  eyes: { label: 'Occhi', view: 'face', paint: 'ink', options: opts(EYES) },
  brows: { label: 'Sopracciglia', view: 'face', paint: 'hairColor', options: opts(BROWS) },
  nose: { label: 'Naso', view: 'face', paint: 'skin', options: opts(NOSES) },
  mouth: { label: 'Bocca', view: 'face', paint: 'ink', options: opts(MOUTHS) },
  details: { label: 'Dettagli', view: 'face', paint: 'skin', options: opts(DETAILS) },
  hair: { label: 'Stile', view: 'full', paint: 'hairColor', options: opts(HAIR) }, // intera: si vede la lunghezza
  hairColor: { label: 'Colore', options: opts(HAIR_COLOR) },
  beard: { label: 'Barba', view: 'chin', paint: 'hairColor', options: opts(BEARDS) },
  top: { label: 'Stile', view: 'top', paint: 'shirt', options: opts(TOPS) },
  shirt: { label: 'Colore', options: opts(SHIRT) },
  hat: { label: 'In testa', view: 'hat', paint: 'shirt', options: opts(HATS) },
  glasses: { label: 'Occhiali', view: 'face', paint: 'ink', options: opts(GLASSES) },
  ears: { label: 'Orecchie', view: 'head', paint: 'ink', options: opts(EARS) },
  bg: { label: 'Sfondo', view: 'full', options: opts(BGS) },
}

// le espressioni che l'app imposta da sola (reazioni nelle lezioni)
export const MOODS = {
  felice: { eyes: 'felici', mouth: 'risata' },
  triste: { eyes: 'tondi', brows: 'preoccupate', mouth: 'triste' },
}

export const DEFAULT = {
  skin: 'chiara', eyes: 'tondi', brows: 'sottili', nose: 'puntino', mouth: 'sorriso', details: 'guance',
  hair: 'corti', hairColor: 'castani', beard: 'nessuna', top: 'maglietta', shirt: 'verde',
  hat: 'nessuno', glasses: 'nessuno', ears: 'nessuno', pin: 'nessuna', bg: 'azzurro',
}

const WORLD = PATHS.filter((p) => !p.unlockedBy).flatMap((p) => p.units.flatMap((u) => u.countries))
const WORLD_CODES = new Set(WORLD.map((c) => c.code))
const valid = (k, v) =>
  k === 'pin' ? v === 'nessuna' || WORLD_CODES.has(v) : Object.hasOwn(SLOTS[k].options, v) && !SLOTS[k].options[v].hidden

// avatar completo e valido: le parti mancanti o sconosciute (rinominate, dati vecchi) tornano al predefinito
export const full = (a) => Object.fromEntries(Object.entries(DEFAULT).map(([k, d]) => [k, valid(k, a?.[k]) ? a[k] : d]))

// --- sblocchi: valori che non scendono mai, così un oggetto sbloccato resta tuo ---

export function avatarStats(p) {
  const doneUnits = (path) => path.units.filter((u) => unitDone(`${path.id}.${u.id}`, p.done))
  const world = PATHS.filter((x) => !x.unlockedBy)
  return {
    xp: p.xp,
    best: p.best ?? 0,
    units: PATHS.reduce((n, x) => n + doneUnits(x).length, 0),
    paths: world.filter((x) => doneUnits(x).length === x.units.length).length,
    learned: world.flatMap((x) => doneUnits(x).flatMap((u) => u.countries)), // spille disponibili
  }
}

export const isUnlocked = (o, stats) => !o.unlock || Object.entries(o.unlock).every(([k, n]) => stats[k] >= n)

const HINTS = {
  xp: (n) => `Raggiungi ${n} XP`,
  best: (n) => `${n} giorni di fila`,
  units: (n) => (n === 1 ? 'Completa la tua prima unità' : `Completa ${n} unità`),
  paths: (n) => (n === 1 ? 'Completa un intero continente' : `Completa ${n} continenti`),
}
export const unlockHint = (o) => Object.entries(o.unlock).map(([k, n]) => HINTS[k](n)).join(' e ')

// oggetti sbloccati passando da before ad after (per l'avviso a fine lezione)
export const newUnlocks = (before, after) =>
  Object.entries(SLOTS).flatMap(([slot, s]) =>
    Object.entries(s.options).filter(([, o]) => o.unlock && !isUnlocked(o, before) && isUnlocked(o, after)).map(([name]) => ({ slot, name })))

const anyOf = (arr) => arr[Math.floor(Math.random() * arr.length)]
export const choices = (slot, stats) => Object.keys(SLOTS[slot].options).filter((n) => !SLOTS[slot].options[n].hidden && isUnlocked(SLOTS[slot].options[n], stats))

export const randomAvatar = (stats) => ({
  ...Object.fromEntries(Object.keys(SLOTS).map((slot) => [slot, anyOf(choices(slot, stats))])),
  pin: anyOf(['nessuna', ...stats.learned.map((c) => c.code)]),
})
