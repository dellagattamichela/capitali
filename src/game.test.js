import test from 'node:test'
import assert from 'node:assert/strict'
import { syllables, normalize, makeQuestion } from './game.js'
import { COUNTRIES } from './data.js'

test('sillabe', () => {
  assert.deepEqual(syllables('Londra'), ['lon', 'dra'])
  assert.deepEqual(syllables('Stoccolma'), ['stoc', 'col', 'ma'])
  assert.deepEqual(syllables('Buenos Aires'), ['bue', 'nos', 'ai', 'res'])
})

test('le sillabe ricompongono ogni capitale', () => {
  for (const { capital } of COUNTRIES) assert.equal(normalize(syllables(capital).join('')), normalize(capital), capital)
})

test('normalize è tollerante', () => {
  assert.equal(normalize("l avana"), normalize("L'Avana"))
  assert.equal(normalize('reykjavik'), normalize('Reykjavík'))
  assert.equal(normalize('chisinau'), normalize('Chișinău'))
})

test('domande', () => {
  const c = COUNTRIES[0]
  const easy = makeQuestion(c, 'easy', COUNTRIES)
  assert.equal(easy.options.length, 4)
  assert.ok(easy.options.includes(c.capital))
  const medium = makeQuestion(c, 'medium', COUNTRIES)
  for (const s of syllables(c.capital)) assert.ok(medium.tiles.includes(s))
})
