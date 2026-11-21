import test from 'node:test'
import assert from 'node:assert/strict'
import { syllables, normalize, makeQuestion, makeLesson, nodesOf, unitDone, finishLesson, streakOn } from './game.js'
import { PATHS } from './data.js'

const ALL = PATHS.flatMap((p) => p.units.flatMap((u) => u.countries))

test('sillabe', () => {
  assert.deepEqual(syllables('Londra'), ['lon', 'dra'])
  assert.deepEqual(syllables('Stoccolma'), ['stoc', 'col', 'ma'])
  assert.deepEqual(syllables('Buenos Aires'), ['bue', 'nos', 'ai', 'res'])
})

test('le sillabe ricompongono ogni capitale', () => {
  for (const { capital } of ALL) assert.equal(normalize(syllables(capital).join('')), normalize(capital), capital)
})

test('normalize è tollerante', () => {
  assert.equal(normalize("l avana"), normalize("L'Avana"))
  assert.equal(normalize('reykjavik'), normalize('Reykjavík'))
  assert.equal(normalize('chisinau'), normalize('Chișinău'))
})

test('dati dei percorsi', () => {
  for (const p of PATHS) {
    const names = p.units.flatMap((u) => u.countries.map((c) => c.name))
    assert.equal(new Set(names).size, names.length, `nomi duplicati in ${p.id}`)
    assert.equal(new Set(p.units.map((u) => u.id)).size, p.units.length, `unità duplicate in ${p.id}`)
    assert.ok(names.length >= 4, `${p.id}: servono almeno 4 paesi per avere 4 opzioni`)
    if (p.unlockedBy) {
      const [pid, uid] = p.unlockedBy.split('.')
      assert.ok(PATHS.find((x) => x.id === pid)?.units.some((u) => u.id === uid), p.unlockedBy)
    }
  }
})

test('domande', () => {
  const all = PATHS[0].units.flatMap((u) => u.countries)
  const easy = makeQuestion(all[0], 'easy', all)
  assert.equal(easy.options.length, 4)
  assert.ok(easy.options.includes(all[0].capital))
  const medium = makeQuestion(all[0], 'medium', all)
  for (const s of syllables(all[0].capital)) assert.ok(medium.tiles.includes(s))
})

test('lezioni del percorso', () => {
  const path = { id: 'x', units: [{ id: 'a', countries: ALL.slice(0, 6) }, { id: 'b', countries: ALL.slice(6, 9) }] }
  const nodes = nodesOf(path)
  assert.equal(nodes.length, 10)

  const intro = makeLesson(path, nodes[5]) // unità b, primo passo: solo 3 paesi
  assert.equal(intro.length, 10)
  assert.ok(intro.slice(1).every((q, i) => q.name !== intro[i].name), 'stesso paese due volte di fila')
  assert.equal(intro.filter((q) => q.isNew).length, 3)
  assert.ok(intro.every((q) => q.level === 'easy' && q.options.length === 4))

  const review = makeLesson(path, nodes[9])
  assert.deepEqual(new Set(review.map((q) => q.level)), new Set(['easy', 'medium', 'hard']))
  assert.ok(review.some((q) => path.units[0].countries.some((c) => c.name === q.name)), 'il ripasso include le unità precedenti')
  assert.ok(review.every((q) => !q.isNew))
})

test('progressi e serie di giorni', () => {
  let p = { done: [], xp: 0, streak: 0, lastDay: null }
  p = finishLesson(p, 'x', 'x.a.0', '2026-11-30')
  p = finishLesson(p, 'x', 'x.a.0', '2026-11-30') // stessa lezione, stesso giorno
  assert.deepEqual([p.done, p.xp, p.streak, p.last], [['x.a.0'], 20, 1, 'x'])
  assert.ok(!unitDone('x.a', p.done))

  p = finishLesson(p, 'x', 'x.a.4', '2026-12-01') // il giorno dopo, a cavallo del mese
  assert.equal(p.streak, 2)
  assert.ok(unitDone('x.a', p.done))
  assert.equal(streakOn(p, '2026-12-02'), 2)
  assert.equal(streakOn(p, '2026-12-03'), 0)
  assert.equal(finishLesson(p, 'x', 'x.b.0', '2026-12-05').streak, 1)
})
