import { SLOTS, avatarUri, full } from './avatarData.js'

// mood: "felice" / "triste" sostituisce occhi e bocca
export function Avatar({ a, mood, className = '' }) {
  const { bg, pin } = full(a)
  return (
    <span className={`avatar ${className}`} style={{ background: SLOTS.bg.options[bg].color }}>
      <img src={avatarUri(a, mood)} alt="" />
      {pin !== 'nessuna' && <img className="pin" src={`https://flagcdn.com/w40/${pin}.png`} alt="" />}
    </span>
  )
}
