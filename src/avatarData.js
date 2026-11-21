// Avatar come dati: niente JSX, così è testabile con node --test.
// I disegni sono lo stile «Big Smile» di DiceBear (https://www.dicebear.com/styles/big-smile/), più barba e baffi
// disegnati qui in fondo: qui ci sono i nomi italiani delle varianti, i colori e le condizioni di sblocco.
import { Avatar, Style } from '@dicebear/core'
import bigSmile from '@dicebear/styles/big-smile.json' with { type: 'json' }
import { PATHS } from './data.js'
import { unitDone } from './game.js'

// dalla più chiara alla più scura; toni poco saturi, senza il giallo-arancio delle emoji
const SKIN = {
  porcellana: '#fcebe2', 'molto chiara': '#f8ddcc', rosata: '#f2ccb7', chiara: '#ecc5a6', beige: '#e0b68f', media: '#cfa07a',
  olivastra: '#c39a6b', ambrata: '#a6764f', scura: '#82553a', 'molto scura': '#613d29', ebano: '#43291b',
}
const HAIR_COLOR = {
  neri: '#2c1b10', castani: '#6b3e1f', nocciola: '#9a6236', biondi: '#e8b84a', platino: '#f1e2b8', rossi: '#c0441d',
  grigi: '#b8b8b8', bianchi: '#f2f2f2', blu: '#1cb0f6', viola: '#ce82ff', rosa: '#ff8fc7', verdi: '#58cc02',
}
const EYE_COLOR = { scuri: '#2a1200', marroni: '#6b3e1f', nocciola: '#9a6b2f', verdi: '#3d8b4f', azzurri: '#3b8ed8', grigi: '#6e7c87' }
const GLASSES_COLOR = { oro: '#c5900f', neri: '#2b2b2b', argento: '#9aa3ab', rossi: '#e03c3c', blu: '#1c7fd6', verdi: '#3a9d23', rosa: '#ff6fae', viola: '#9b59d6' }
// le lenti sono in "multiply" sopra il viso: colori pieni, altrimenti spariscono
const LENS_COLOR = { scure: '#595757', blu: '#3b6fd8', verdi: '#3f8f55', rosa: '#ff6fa5', gialle: '#f2b600', viola: '#8a5cf0', rosse: '#d83b3b' }

const EYES = {
  tondi: 'normal', felici: 'cheery', assonnati: 'sleepy', occhiolino: 'winking', stellati: 'starstruck', arrabbiati: 'angry', confusi: 'confused',
  tristi: { variant: 'sad', hidden: true },
}
const BROWS = { naturali: 'natural', sottili: 'thin', folte: 'thick', unite: 'unibrow', 'con taglio': 'slit' }
const LASHES = { nessuna: {}, corte: 'short', lunghe: 'long' }
const MOUTHS = {
  sorriso: 'openedSmile', risata: 'teethSmile', sorrisetto: 'kawaii', neutra: 'unimpressed', imbarazzata: 'awkwardSmile', sdentata: 'gapSmile', apparecchio: 'braces',
  triste: { variant: 'openSad', hidden: true },
}
const HAIR = {
  corti: 'shortHair', lisci: 'straightHair', frangia: 'bangs', 'a scodella': 'bowlCutHair', trecce: 'braids', chignon: 'bunHair', caschetto: 'wavyBob',
  'caschetto riccio': 'curlyBob', ricci: 'curlyShortHair', 'chignon riccio': 'froBun', undercut: 'halfShavedHead', cresta: 'mohawk', rasati: 'shavedHead',
}
const BEARDS = { nessuna: {}, accennata: 'stubble', corta: 'short' }
const MUSTACHES = { nessuno: {}, folti: 'bushy', sottili: 'pencil', 'a manubrio': 'handlebar' }
const ACCESSORIES = {
  nessuno: {}, occhiali: 'glasses', 'naso da clown': 'clownNose', mascherina: 'faceMask', 'benda per dormire': 'sleepMask',
  'da sole': { variant: 'sunglasses', unlock: { units: 1 } },
  'orecchie da gatto': { variant: 'catEars', unlock: { best: 7 } },
  corona: { variant: 'sailormoonCrown', unlock: { xp: 500 } },
}
const BGS = {
  azzurro: '#ddf4ff', verde: '#d7ffb8', rosa: '#ffdfe0', giallo: '#fff4c2', lilla: '#f3e0ff', pesca: '#ffe8cc',
  menta: '#c8f7e1', corallo: '#ffcbc1', sabbia: '#f3e7cf', perla: '#ececec', cielo: '#a9dcff', 'blu notte': '#26325c', bosco: '#2f5d46',
  arcobaleno: { unlock: { paths: 1 }, color: 'linear-gradient(135deg, #ffdfe0, #fff4c2, #d7ffb8, #ddf4ff, #f3e0ff)' },
}

// stringa = colore (#...) o variante di Big Smile, oggetto = già completo
const opts = (table) =>
  Object.fromEntries(Object.entries(table).map(([k, o]) => [k, typeof o !== 'string' ? o : o.startsWith('#') ? { color: o } : { variant: o }]))

// le parti con una variante hanno lo stesso nome del componente DiceBear (vedi COMPONENTS)
export const SLOTS = {
  skin: { label: 'Pelle', options: opts(SKIN) },
  eyes: { label: 'Occhi', options: opts(EYES) },
  eyeColor: { label: 'Colore occhi', options: opts(EYE_COLOR) },
  lashes: { label: 'Ciglia', options: opts(LASHES) },
  brows: { label: 'Sopracciglia', options: opts(BROWS) },
  mouth: { label: 'Bocca', options: opts(MOUTHS) },
  hair: { label: 'Stile', options: opts(HAIR) },
  hairColor: { label: 'Colore (anche di barba e baffi)', options: opts(HAIR_COLOR) },
  beard: { label: 'Barba', options: opts(BEARDS) },
  mustache: { label: 'Baffi', options: opts(MUSTACHES) },
  accessories: { label: 'Accessori', options: opts(ACCESSORIES) },
  // accessory: nell'editor compare solo con quell'accessorio addosso
  glassesColor: { label: 'Colore occhiali', accessory: 'occhiali', options: opts(GLASSES_COLOR) },
  lensColor: { label: 'Colore lenti', accessory: 'da sole', options: opts(LENS_COLOR) },
  bg: { label: 'Sfondo', options: opts(BGS) },
}

// le espressioni che l'app imposta da sola (reazioni nelle lezioni)
export const MOODS = {
  felice: { eyes: 'felici', mouth: 'risata' },
  triste: { eyes: 'tristi', mouth: 'triste' },
}

export const DEFAULT = {
  skin: 'chiara', eyes: 'tondi', eyeColor: 'scuri', lashes: 'nessuna', brows: 'naturali', mouth: 'sorriso', hair: 'corti', hairColor: 'castani', beard: 'nessuna', mustache: 'nessuno',
  accessories: 'nessuno', glassesColor: 'oro', lensColor: 'scure', pin: 'nessuna', bg: 'azzurro',
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

// --- lo stile: Big Smile con qualche aggiunta ---

const el = (name, attributes, children) => ({ type: 'element', name, attributes, ...(children && { children }) })
const hair = { type: 'color', name: 'hair' }
const shape = (d) => el('path', { d, fill: hair })
const line = (d, width, stroke = hair) => el('path', { d, fill: 'none', stroke, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
const r1 = (v) => Math.round(v * 10) / 10
// le parti che dipendono da un'altra hanno una variante per ogni combinazione: tipo + altra, es. "shortOpenedSmile"
const combo = (type, other) => type + other[0].toUpperCase() + other.slice(1)
const { canvas, components: parts, colors } = bigSmile

// Big Smile fa scegliere solo i colori di pelle e capelli: i colori fissi di occhi e occhiali diventano colori scelti
const recolor = (part, map) =>
  JSON.parse(JSON.stringify(part).replace(/"fill":"(#\w{6})"/g, (m, c) => (map[c] ? `"fill":{"type":"color","name":"${map[c]}"}` : m)))

// i componenti sono posizionati da matrix(a 0 0 d e f): questa porta le coordinate di `from` in quelle di `to`
const matrix = (name) => canvas.elements.find((e) => e.name === name).attributes.transform.match(/[-\d.]+/g).map(Number)
function between(from, to) {
  const [a, , , d, e, f] = matrix(from)
  const [A, , , D, E, F] = matrix(to)
  return `matrix(${a / A} 0 0 ${d / D} ${(e - E) / A} ${(f - F) / D})`
}

// Barba e baffi: in Big Smile non ci sono, si disegnano nelle coordinate della testa (428 x 388) col colore dei capelli.
// La barba è il contorno della testa (così segue la mascella) mostrato solo nella sua zona: sotto la "linea della
// barba" (basetta davanti all'orecchio → sotto la guancia → all'altezza della bocca) più un contorno attorno alla
// bocca, labbro di sopra compreso. Il contorno dipende dalla forma della bocca: una variante per ogni tipo × bocca.
const [HEAD, CHEEKS, NOSE, EAR, EAR_IN] = parts.head.variants.base.elements
const BEARD_LINE = 'M-40 212 H92 C105 255 140 300 200 312 C220 306 232 292 250 286 H460 V460 H-40 Z'
const STUBBLE = el('pattern', { id: 'beard-stubble', width: '8', height: '8', patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(25)' }, [
  el('circle', { cx: '2', cy: '2', r: '1.4', fill: hair }),
])
// strati della barba: il contorno della testa con questi attributi
const BEARD_TYPES = {
  stubble: [{ opacity: '.15' }, { fill: 'url(#beard-stubble)', opacity: '.55' }], // velatura + puntini
  short: [{ stroke: hair, 'stroke-width': '10' }], // il tratto la fa sporgere un poco oltre il mento
}
// la sagoma della bocca (coordinate della bocca → della testa) allargata di width / 2, per le maschere
const mouthOutline = (elements, width, dy = 0) => el('g', { transform: `translate(0 ${dy}) ${between('mouth', 'head')}` }, elements.map((e) => ({
  ...e, attributes: { ...e.attributes, fill: '#fff', stroke: '#fff', 'stroke-width': width, 'stroke-linejoin': 'round' },
})))
function beardFor(type, mouth, { elements }) {
  const [area, lips] = [`beard-area-${mouth}`, `beard-lips-${mouth}`]
  return {
    elements: [
      el('defs', {}, [
        STUBBLE,
        el('mask', { id: area }, [
          el('path', { d: BEARD_LINE, fill: '#fff' }),
          mouthOutline(elements, '46', 6), // contorno di 23, spostato in giù: sopra la bocca resta più sottile
          el('ellipse', { cx: '338', cy: '219', rx: '22', ry: '10', fill: '#000' }), // il naso resta scoperto
        ]),
        el('mask', { id: lips }, [mouthOutline(elements, '10')]),
      ]),
      ...BEARD_TYPES[type].map((attributes) => el('g', { mask: `url(#${area})` }, [el('path', { d: HEAD.attributes.d, fill: hair, ...attributes })])),
      el('g', { mask: `url(#${lips})` }, [HEAD, CHEEKS, NOSE]), // un filo di pelle attorno alla bocca: le labbra
      EAR, EAR_IN, // l'orecchio resta davanti alla barba
    ],
  }
}
const BEARD = {
  width: parts.head.width,
  height: parts.head.height,
  variants: Object.fromEntries(Object.keys(BEARD_TYPES).flatMap((type) =>
    Object.entries(parts.mouth.variants).map(([mouth, variant]) => [combo(type, mouth), beardFor(type, mouth, variant)]))),
}
// i baffi di Big Smile (erano un accessorio) col colore dei capelli, più l'ombra che avevano
const BUSHY = parts.accessories.variants.mustache.elements.flatMap((e) => [
  { ...e, attributes: { ...e.attributes, fill: hair } },
  ...(e.attributes.fill === '#5E351B' ? [{ ...e, attributes: { ...e.attributes, fill: '#000', opacity: '.15' } }] : []),
])
const MUSTACHE = {
  width: parts.head.width,
  height: parts.head.height,
  variants: {
    bushy: { elements: [el('g', { transform: between('accessories', 'head') }, BUSHY)] },
    pencil: {
      elements: [
        shape('M246 252 C268 230 306 226 336 232 C338 240 336 246 332 249 C300 244 272 246 246 252 Z'),
        shape('M344 232 C370 230 392 236 406 250 C386 246 366 246 348 249 C343 246 341 239 344 232 Z'),
      ],
    },
    handlebar: {
      elements: [
        line('M336 238 C306 228 282 264 250 250 C232 242 234 220 250 218', '16'),
        line('M342 238 C366 230 386 258 408 246 C419 239 418 223 407 221', '13'),
        el('ellipse', { cx: '339', cy: '240', rx: '17', ry: '11', fill: hair }),
      ],
    },
  },
}
// Sopracciglia e ciglia, nelle coordinate degli occhi (149 x 106). In Big Smile ogni variante degli occhi ha un
// tracciato per i due occhi (#2A1200) e uno per le due sopracciglia (#71472D): le sopracciglia diventano un componente
// a parte con gli stili ricavati dalla forma originale, così tengono la posa di ogni variante (arrabbiati, tristi...).
const isBrow = (e) => e.attributes.fill === '#71472D'
// estremi interni delle sopracciglia [x, y del sinistro, x, y del destro], misurati sui disegni: per unirle
const BROW_INNER = {
  angry: [56, 41.4, 107.9, 42.5], cheery: [57.5, 28.4, 112, 31.2], confused: [56.4, 27.9, 106.5, 51], normal: [58.3, 33.1, 110.5, 34.5],
  sad: [51.8, 27.5, 113.2, 32.5], sleepy: [58.3, 33.1, 110.5, 34.5], starstruck: [54, 23, 109, 25.5], winking: [57.5, 28.4, 112, 31.2],
}
const masked = (id, mask, d) => [el('defs', {}, [el('mask', { id }, mask)]), el('g', { mask: `url(#${id})` }, [shape(d)])]
const BROW_STYLES = {
  natural: (d) => [shape(d)],
  // la forma meno un bordo di 3,5 (il tratto nero nella maschera la "rosicchia"): stessa posa, più sottile
  thin: (d, id) => masked(id, [el('path', { d, fill: '#fff' }), el('path', { d, fill: 'none', stroke: '#000', 'stroke-width': '7' })], d),
  thick: (d) => [el('path', { d, fill: hair, stroke: hair, 'stroke-width': '6', 'stroke-linejoin': 'round' })],
  unibrow: (d, id, eyes) => {
    const [x1, y1, x2, y2] = BROW_INNER[eyes]
    return [shape(d), line(`M${x1 - 4} ${y1} Q${r1((x1 + x2) / 2)} ${r1((y1 + y2) / 2 + 3)} ${x2 + 4} ${y2}`, '8')]
  },
  // un taglio obliquo verso l'esterno del sopracciglio sinistro
  slit: (d, id) => masked(id, [
    el('rect', { x: '-10', y: '-10', width: '170', height: '130', fill: '#fff' }),
    el('rect', { x: '20', y: '0', width: '4', height: '70', fill: '#000', transform: 'rotate(18 22 35)' }),
  ], d),
}
const EYES_SIZE = { width: parts.eyes.width, height: parts.eyes.height }
const BROWS_PART = {
  ...EYES_SIZE,
  variants: Object.fromEntries(Object.entries(BROW_STYLES).flatMap(([style, draw]) => Object.entries(parts.eyes.variants).map(([eyes, v]) =>
    [combo(style, eyes), { elements: draw(v.elements.find(isBrow).attributes.d, `brows-${style}-${eyes}`, eyes) }]))),
}

// Ciglia: per ogni variante degli occhi l'ellisse di ogni occhio [cx, cy, rx, ry] (sinistro, destro), misurata sui
// disegni; negli occhi chiusi è l'arco della palpebra. Le ciglia partono dal quarto esterno in alto (negli "sleepy",
// arco all'ingiù, in basso), lungo la perpendicolare all'ellisse, e piegano un po' verso l'esterno.
const EYE_ELLIPSES = {
  angry: [[30.1, 82.1, 17.3, 18.6], [123.9, 81.5, 11.3, 14.9]], cheery: [[30.9, 77.4, 17.1, 19.9], [123.2, 78.8, 11.1, 15.2]],
  confused: [[29, 79.1, 17.3, 21.6], [122.9, 82.9, 11.3, 13.4]], normal: [[30, 79.1, 17.3, 21.6], [123.9, 79.8, 11.3, 16.6]],
  sad: [[29.2, 81.8, 17.4, 19], [123.8, 80.7, 11.4, 15.6]], sleepy: [[35.6, 70, 21.9, 18.6], [123.1, 77, 11.2, 13.8]],
  starstruck: [[34.2, 72.3, 25, 27.1], [120.3, 69.9, 15.1, 24.5]], winking: [[35.6, 89.3, 21.9, 19.1], [123.9, 79.8, 11.3, 16.6]],
}
// angoli in gradi per l'occhio sinistro (y in giù: 180 = fuori a sinistra, 270 = in alto); il destro è speculare
const LASH_STYLES = { short: { angles: [212, 238], length: 8, width: '2.6' }, long: { angles: [200, 222, 244], length: 12, width: '3' } }
function lashesFor({ angles, length, width }, eyes) {
  return EYE_ELLIPSES[eyes].flatMap(([cx, cy, rx, ry], right) => angles.map((deg) => {
    let t = (deg * Math.PI) / 180
    if (right) t = Math.PI - t
    if (eyes === 'sleepy') t = -t
    const [px, py] = [cx + rx * Math.cos(t), cy + ry * Math.sin(t)]
    const n = Math.atan2(Math.sin(t) / ry, Math.cos(t) / rx) // perpendicolare all'ellisse
    const out = n + 0.3 * Math.sign(Math.sin((right ? 0 : Math.PI) - n)) // piegata verso l'esterno
    const len = length * (0.55 + (0.45 * rx) / 17.3) // l'occhio destro, più piccolo, ha ciglia più corte
    const at = (a, l) => `${r1(px + l * Math.cos(a))} ${r1(py + l * Math.sin(a))}`
    return line(`M${at(n, -1.5)} Q${at(n, len * 0.55)} ${at(out, len)}`, width, '#2A1200')
  }))
}
const LASHES_PART = {
  ...EYES_SIZE,
  variants: Object.fromEntries(Object.entries(LASH_STYLES).flatMap(([style, s]) => Object.keys(parts.eyes.variants).map((eyes) =>
    [combo(style, eyes), { elements: lashesFor(s, eyes) }]))),
}

// la barba subito dopo la testa (sotto la bocca), i baffi dopo la bocca, sopracciglia e ciglia dopo gli occhi (sotto
// i capelli, come prima). [componente, posizionato come]
const ADD = { head: [['beard', 'head']], mouth: [['mustache', 'head']], eyes: [['brows', 'eyes'], ['lashes', 'eyes']] }
const at = (name) => canvas.elements.find((e) => e.name === name).attributes

const style = new Style({
  ...bigSmile,
  canvas: { ...canvas, elements: canvas.elements.flatMap((e) => [e, ...(ADD[e.name] ?? []).map(([name, pos]) => ({ type: 'component', name, attributes: at(pos) }))]) },
  components: {
    ...parts,
    eyes: recolor({ ...parts.eyes, variants: Object.fromEntries(Object.entries(parts.eyes.variants).map(([name, v]) =>
      [name, { ...v, elements: v.elements.filter((e) => !isBrow(e)) }])) }, { '#2A1200': 'eye' }),
    brows: BROWS_PART,
    lashes: LASHES_PART,
    accessories: {
      ...parts.accessories,
      variants: {
        ...parts.accessories.variants,
        glasses: recolor(parts.accessories.variants.glasses, { '#896307': 'glasses', '#C5900F': 'glasses' }),
        sunglasses: recolor(parts.accessories.variants.sunglasses, { '#595757': 'lens' }),
      },
    },
    beard: BEARD,
    mustache: MUSTACHE,
  },
  colors: { ...colors, eye: { values: ['#2A1200'] }, glasses: { values: ['#C5900F'] }, lens: { values: ['#595757'] } },
})

// le parti disegnate da un componente; "nessuno" (niente variante) = probabilità 0
const COMPONENTS = ['hair', 'eyes', 'brows', 'lashes', 'mouth', 'beard', 'mustache', 'accessories']
// la barba contorna la bocca, sopracciglia e ciglia seguono gli occhi: la variante è la combinazione
const FOLLOWS = { beard: 'mouth', brows: 'eyes', lashes: 'eyes' }

// anteprime ingrandite dell'editor, dentro il disegno (uno zoom CSS uscirebbe dal cerchio su Safari): DiceBear
// ingrandisce attorno al centro, poi sposta in % del disegno; spostamento = -scala × (centro della zona - 50)
const ZOOMS = {
  eyes: { scale: 1.8, translateX: -31.5, translateY: 10.8 }, // occhi e sopracciglia: x 54-81%, y 30-58%
  mouth: { scale: 1.6, translateX: -25.6, translateY: -26.4 }, // bocca e baffi: x 46-86%, y 53-80%
}

// immagine dell'avatar (data URI, senza sfondo né spilla); mood: "felice" / "triste" sostituisce occhi e bocca
export function avatarUri(saved, mood, zoom) {
  const a = { ...full(saved), ...MOODS[mood] }
  const opt = (slot) => SLOTS[slot].options[a[slot]]
  const options = {
    skinColor: opt('skin').color,
    hairColor: opt('hairColor').color,
    eyeColor: opt('eyeColor').color,
    glassesColor: opt('glassesColor').color,
    lensColor: opt('lensColor').color,
  }
  for (const slot of COMPONENTS) {
    const { variant } = opt(slot)
    options[`${slot}Probability`] = variant ? 100 : 0
    if (variant) options[`${slot}Variant`] = variant
  }
  for (const [slot, other] of Object.entries(FOLLOWS)) {
    if (options[`${slot}Variant`]) options[`${slot}Variant`] = combo(options[`${slot}Variant`], options[`${other}Variant`])
  }
  return new Avatar(style, { ...options, ...ZOOMS[zoom] }).toDataUri()
}
