import test from 'node:test'
import assert from 'node:assert/strict'
import { syllables, normalize, makeQuestion, makeLesson, nodesOf, unitDone, finishLesson, streakOn, jumpTest, isOpen, learned, partOf, practice } from './game.js'
import { PATHS } from './data.js'

const ALL = PATHS.flatMap((p) => p.units.flatMap((u) => u.countries))

test('sillabe', () => {
  assert.deepEqual(syllables('Londra'), ['lon', 'dra'])
  assert.deepEqual(syllables('Stoccolma'), ['stoc', 'col', 'ma'])
  assert.deepEqual(syllables('Buenos Aires'), ['bue', 'nos', 'ai', 'res'])
  assert.deepEqual(syllables('Port-au-Prince'), ['port', 'au', 'prin', 'ce'])
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
  const world = PATHS.filter((p) => !p.unlockedBy).flatMap((p) => p.units.flatMap((u) => u.countries.map((c) => c.code)))
  assert.equal(new Set(world).size, world.length, 'paese in due continenti')
  assert.equal(world.length, 194) // membri ONU + Vaticano
})

test('domande', () => {
  const all = PATHS[0].units.flatMap((u) => u.countries)
  const easy = makeQuestion(all[0], 'easy', all)
  assert.equal(easy.options.length, 4)
  assert.ok(easy.options.includes(all[0].capital))
  const medium = makeQuestion(all[0], 'medium', all)
  for (const s of syllables(all[0].capital)) assert.ok(medium.tiles.includes(s))
  const reverse = makeQuestion(all[0], 'reverse', all)
  assert.equal(reverse.options.length, 4)
  assert.ok(reverse.options.includes(all[0].name))
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
  const later = makeLesson(path, nodes[5], 1) // seconda lezione dello stesso passo
  assert.ok(later.every((q) => !q.isNew))
  assert.ok(later.some((q) => path.units[0].countries.some((c) => c.name === q.name)), 'dopo la prima lezione tornano le unità precedenti')

  const review = makeLesson(path, nodes[9])
  assert.deepEqual(new Set(review.map((q) => q.level)), new Set(['easy', 'medium', 'hard', 'reverse']))
  assert.ok(review.some((q) => path.units[0].countries.some((c) => c.name === q.name)), 'il ripasso include le unità precedenti')
  assert.ok(review.every((q) => !q.isNew))

  const jump = jumpTest(path, 1)
  assert.deepEqual(jump.clears, nodes.filter((n) => n.u === 0).map((n) => n.id))
  const test = makeLesson(path, jump)
  assert.ok(test.every((q) => path.units[0].countries.some((c) => c.name === q.name)), 'il test copre solo le unità saltate')
  assert.ok(unitDone('x.a', finishLesson({ done: [], xp: 0, streak: 0 }, 'x', jump, '2026-11-30').done))
})

test('progressi e serie di giorni', () => {
  let p = { done: [], xp: 0, streak: 0, lastDay: null, name: 'Ada' }
  const a0 = { id: 'x.a.0', parts: 2 }
  p = finishLesson(p, 'x', a0, '2026-11-30')
  assert.deepEqual([p.done, p.parts], [[], { 'x.a.0': 1 }]) // prima lezione del passo su due
  p = finishLesson(p, 'x', a0, '2026-11-30') // stesso passo, stesso giorno
  assert.deepEqual([p.done, p.parts, p.xp, p.streak, p.last], [['x.a.0'], {}, 20, 1, 'x'])
  assert.equal(partOf(p, a0), 1) // un passo completato si ripete dall'ultima lezione
  assert.ok(!unitDone('x.a', p.done))

  p = finishLesson(p, 'x', { id: 'x.a.4', parts: 1 }, '2026-12-01') // il giorno dopo, a cavallo del mese
  assert.equal(p.streak, 2)
  assert.ok(unitDone('x.a', p.done))
  assert.ok(isOpen({ unlockedBy: 'x.a' }, p.done) && !isOpen({ unlockedBy: 'x.b' }, p.done))
  assert.equal(streakOn(p, '2026-12-02'), 2)
  assert.equal(streakOn(p, '2026-12-03'), 0)
  const broken = finishLesson(p, 'x', { id: 'x.b.0', parts: 1 }, '2026-12-05')
  assert.deepEqual([broken.streak, broken.best, broken.name], [1, 2, 'Ada']) // il record resta, il profilo pure
  assert.deepEqual(learned({ id: 'x', units: [{ id: 'a', countries: [1, 2, 3] }, { id: 'b', countries: [4] }] }, p.done), [1, 2, 3])
})

test('ripasso libero delle città imparate', () => {
  const path = { id: 'x', units: [{ id: 'a', countries: ALL.slice(0, 3) }, { id: 'b', countries: ALL.slice(3, 9) }] }
  const p = { done: ['x.a.4'], parts: { 'x.b.0': 1 }, xp: 0, streak: 0, last: 'y' }
  const qs = makeLesson(path, practice(path, p.done))
  assert.equal(qs.length, 10)
  assert.ok(qs.every((q) => path.units[0].countries.some((c) => c.name === q.name)), 'solo le unità completate')
  assert.ok(qs.every((q) => !q.isNew))
  assert.deepEqual(new Set(qs.map((q) => q.level)), new Set(['easy', 'medium', 'hard', 'reverse']))
  const after = finishLesson(p, 'x', practice(path, p.done), '2026-11-30')
  assert.deepEqual([after.done, after.parts, after.xp, after.last], [p.done, p.parts, 10, 'y']) // XP sì, percorso invariato
})
