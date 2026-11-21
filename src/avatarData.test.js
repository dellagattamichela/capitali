import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT, MOODS, SLOTS, avatarStats, full, isUnlocked, newUnlocks, paint, randomAvatar, viewBox } from './avatarData.js'
import { nodesOf } from './game.js'
import { PATHS } from './data.js'

const ZERO = { xp: 0, best: 0, units: 0, paths: 0, learned: [] }

test('predefiniti esistenti e sbloccati da subito', () => {
  for (const [slot, s] of Object.entries(SLOTS)) {
    const o = s.options[DEFAULT[slot]]
    assert.ok(o, `${slot}: ${DEFAULT[slot]} non esiste`)
    assert.ok(isUnlocked(o, ZERO) && !o.hidden, slot)
  }
  assert.deepEqual(full(), DEFAULT)
})

test('gli umori usano opzioni esistenti', () => {
  for (const m of Object.values(MOODS)) for (const [slot, name] of Object.entries(m)) assert.ok(SLOTS[slot].options[name], `${slot}: ${name}`)
})

test('forme ben formate', () => {
  const tokens = new Set(['base', 'shade', 'light', 'faint', 'cheek', 'ink'])
  for (const [slot, s] of Object.entries(SLOTS)) {
    for (const [name, o] of Object.entries(s.options)) {
      for (const [token, d] of ['back', 'front'].flatMap((l) => o[l] ?? [])) {
        assert.ok(tokens.has(token) || /^#[0-9a-f]{3,6}$/i.test(token), `${slot}/${name}: colore ${token}`)
        assert.match(typeof d === 'function' ? d(10) : d, /^M/, `${slot}/${name}`)
      }
    }
  }
  assert.equal(paint('base', '#123456'), '#123456')
})

test('full ripara gli avatar salvati', () => {
  const a = full({ skin: 'scura', hair: 'inesistente', eyes: 'constructor', mouth: 'triste', pin: 'xx', extra: 'occhiali' })
  assert.equal(a.skin, 'scura')
  assert.equal(a.hair, DEFAULT.hair)
  assert.equal(a.eyes, DEFAULT.eyes) // nome che esiste sugli oggetti JS ma non è un'opzione
  assert.equal(a.mouth, DEFAULT.mouth) // nascosta: solo per le reazioni
  assert.equal(a.pin, 'nessuna')
  assert.equal('extra' in a, false)
  assert.equal(full({ pin: 'it' }).pin, 'it')
})

test('sblocchi', () => {
  const corona = SLOTS.hat.options.corona
  assert.ok(!isUnlocked(corona, { ...ZERO, xp: 499 }))
  assert.ok(isUnlocked(corona, { ...ZERO, xp: 500 }))
  assert.deepEqual(newUnlocks({ ...ZERO, xp: 490 }, { ...ZERO, xp: 500, units: 1 }), [
    { slot: 'hat', name: 'esploratore' },
    { slot: 'hat', name: 'corona' },
  ])
  assert.deepEqual(newUnlocks({ ...ZERO, xp: 500 }, { ...ZERO, xp: 510 }), [])
})

test('statistiche per gli sblocchi', () => {
  const europa = PATHS.find((p) => p.id === 'europa')
  const done = nodesOf(europa).filter((n) => n.u === 0).map((n) => n.id)
  const s = avatarStats({ xp: 50, best: 3, done })
  assert.deepEqual([s.xp, s.best, s.units, s.paths], [50, 3, 1, 0])
  assert.deepEqual(s.learned.map((c) => c.code), europa.units[0].countries.map((c) => c.code))
  const all = nodesOf(europa).map((n) => n.id)
  assert.equal(avatarStats({ xp: 0, done: all }).paths, 1)
})

test('il dado sceglie solo tra le opzioni sbloccate', () => {
  for (let i = 0; i < 200; i++) {
    const a = randomAvatar(ZERO)
    assert.deepEqual(full(a), a)
    assert.ok(Object.entries(SLOTS).every(([slot, s]) => isUnlocked(s.options[a[slot]], ZERO)))
    assert.equal(a.pin, 'nessuna')
  }
})

test('le inquadrature si allargano invece di tagliare corona e capelli alti', () => {
  const { hair: { options: hair }, hat: { options: hat } } = SLOTS
  assert.equal(viewBox('head', hair.corti, hat.nessuno), '10 -2 80 80') // tutto dentro: inquadratura normale
  for (const [name, h] of Object.entries(hair)) {
    const y = Number(viewBox('head', h, hat.corona).split(' ')[1])
    assert.ok(y <= hat.corona.reach(h.top) - 2, name)
  }
  assert.equal(viewBox('face', hair.afro, hat.corona), '25 25 50 50') // gli zoom sul viso restano fermi
})
