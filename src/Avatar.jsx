import { useId } from 'react'
import { INK, MOODS, SLOTS, TORSO, full, paint, viewBox } from './avatarData.js'

function Shapes({ list = [], color, top }) {
  return list.map(([token, d, width], i) => {
    const path = typeof d === 'function' ? d(top) : d
    const c = paint(token, color)
    return width
      ? <path key={i} d={path} fill="none" style={{ stroke: c }} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      : <path key={i} d={path} style={{ fill: c }} />
  })
}

// mood: "felice" / "triste" sostituisce occhi, sopracciglia e bocca; view: inquadratura (viewBox)
export function Avatar({ a: saved, mood, view = 'full', className = '' }) {
  const id = useId()
  const a = { ...full(saved), ...MOODS[mood] }
  const opt = (slot) => SLOTS[slot].options[a[slot]]
  const colors = { ink: INK, skin: opt('skin').color, hairColor: opt('hairColor').color, shirt: opt('shirt').color }
  const hair = opt('hair')
  const hat = opt('hat')
  const top = hair.top
  const layer = (slot, which = 'front', o = opt(slot)) => <Shapes list={o[which]} color={colors[SLOTS[slot].paint]} top={top} />
  const skin = colors.skin

  return (
    <span className={`avatar ${className}`} style={{ background: opt('bg').color }}>
      <svg viewBox={viewBox(view, hair, hat)} aria-hidden="true" fillRule="evenodd">
        <defs>
          <clipPath id={`${id}h`}><path d={hat.clip ?? 'M-20 -20 H120 V120 H-20 Z'} /></clipPath>
          <clipPath id={`${id}t`}><path d={TORSO} /></clipPath>
          <clipPath id={`${id}p`}><circle cx="67" cy="90" r="5" /></clipPath>
        </defs>
        <Shapes list={opt('bg').front} />
        <g clipPath={`url(#${id}h)`}>{layer('hair', 'back')}</g>
        {layer('top', 'back')}

        <rect x="43.5" y="60" width="13" height="28" rx="5" style={{ fill: skin }} />
        <path d="M43.5 64 H56.5 V70 Q50 73.5 43.5 70 Z" style={{ fill: paint('shade', skin) }} />
        <g clipPath={`url(#${id}t)`}>{layer('top')}</g>
        {a.pin !== 'nessuna' && (
          <>
            <image href={`https://flagcdn.com/w40/${a.pin}.png`} x="62" y="85" width="10" height="10" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}p)`} />
            <circle cx="67" cy="90" r="5" fill="none" stroke="#fff" strokeWidth="1.4" />
          </>
        )}

        <circle cx="24" cy="47" r="5.5" style={{ fill: skin }} />
        <circle cx="76" cy="47" r="5.5" style={{ fill: skin }} />
        <circle cx="24.5" cy="47" r="2.4" style={{ fill: paint('shade', skin) }} />
        <circle cx="75.5" cy="47" r="2.4" style={{ fill: paint('shade', skin) }} />
        <ellipse cx="50" cy="44" rx="26" ry="25" style={{ fill: skin }} />

        {layer('details')}
        {layer('eyes')}
        {layer('brows')}
        {/* naso, uguale per tutti */}
        <ellipse cx="50" cy="53" rx="2.2" ry="1.6" style={{ fill: paint('shade', skin) }} />
        {layer('beard')}
        {layer('mouth')}
        <g clipPath={`url(#${id}h)`}>{layer('hair')}</g>
        {/* orecchie sopra i capelli: con quelli lunghi o ricci orecchini e apparecchio non spariscono */}
        {layer('ears')}
        {layer('glasses')}
        {layer('hat')}
      </svg>
    </span>
  )
}
