// Avatar come dati: niente JSX, così è testabile con node --test.
// I disegni sono lo stile «Big Smile» di DiceBear (https://www.dicebear.com/styles/big-smile/):
// qui ci sono i nomi italiani delle sue varianti, i colori e le condizioni di sblocco.
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
const MOUTHS = {
  sorriso: 'openedSmile', risata: 'teethSmile', sorrisetto: 'kawaii', neutra: 'unimpressed', imbarazzata: 'awkwardSmile', sdentata: 'gapSmile', apparecchio: 'braces',
  triste: { variant: 'openSad', hidden: true },
}
const HAIR = {
  corti: 'shortHair', lisci: 'straightHair', frangia: 'bangs', 'a scodella': 'bowlCutHair', trecce: 'braids', chignon: 'bunHair', caschetto: 'wavyBob',
  'caschetto riccio': 'curlyBob', ricci: 'curlyShortHair', 'chignon riccio': 'froBun', undercut: 'halfShavedHead', cresta: 'mohawk', rasati: 'shavedHead',
}
const ACCESSORIES = {
  nessuno: {}, occhiali: 'glasses', baffi: 'mustache', 'naso da clown': 'clownNose', mascherina: 'faceMask', 'benda per dormire': 'sleepMask',
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

// le parti con una variante hanno lo stesso nome del componente di Big Smile
export const SLOTS = {
  skin: { label: 'Pelle', options: opts(SKIN) },
  eyes: { label: 'Occhi', options: opts(EYES) },
  eyeColor: { label: 'Colore occhi', options: opts(EYE_COLOR) },
  mouth: { label: 'Bocca', options: opts(MOUTHS) },
  hair: { label: 'Stile', options: opts(HAIR) },
  hairColor: { label: 'Colore', options: opts(HAIR_COLOR) },
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
  skin: 'chiara', eyes: 'tondi', eyeColor: 'scuri', mouth: 'sorriso', hair: 'corti', hairColor: 'castani',
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

// Big Smile fa scegliere solo i colori di pelle e capelli: i colori fissi di occhi e occhiali diventano colori
// scelti, e le sopracciglia (#71472D negli occhi) prendono il colore dei capelli
const recolor = (part, map) =>
  JSON.parse(JSON.stringify(part).replace(/"fill":"(#\w{6})"/g, (m, c) => (map[c] ? `"fill":{"type":"color","name":"${map[c]}"}` : m)))
const { components: parts, colors } = bigSmile
const style = new Style({
  ...bigSmile,
  components: {
    ...parts,
    eyes: recolor(parts.eyes, { '#2A1200': 'eye', '#71472D': 'hair' }),
    accessories: {
      ...parts.accessories,
      variants: {
        ...parts.accessories.variants,
        glasses: recolor(parts.accessories.variants.glasses, { '#896307': 'glasses', '#C5900F': 'glasses' }),
        sunglasses: recolor(parts.accessories.variants.sunglasses, { '#595757': 'lens' }),
      },
    },
  },
  colors: { ...colors, eye: { values: ['#2A1200'] }, glasses: { values: ['#C5900F'] }, lens: { values: ['#595757'] } },
})

// immagine dell'avatar (data URI, senza sfondo né spilla); mood: "felice" / "triste" sostituisce occhi e bocca
export function avatarUri(saved, mood) {
  const a = { ...full(saved), ...MOODS[mood] }
  const opt = (slot) => SLOTS[slot].options[a[slot]]
  const accessory = opt('accessories').variant
  return new Avatar(style, {
    skinColor: opt('skin').color,
    hairColor: opt('hairColor').color,
    eyeColor: opt('eyeColor').color,
    glassesColor: opt('glassesColor').color,
    lensColor: opt('lensColor').color,
    hairVariant: opt('hair').variant,
    eyesVariant: opt('eyes').variant,
    mouthVariant: opt('mouth').variant,
    accessoriesProbability: accessory ? 100 : 0,
    ...(accessory && { accessoriesVariant: accessory }),
  }).toDataUri()
}
