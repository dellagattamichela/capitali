import { SLOTS, avatarUri, full } from './avatarData.js'

// mood: "felice" / "triste" sostituisce occhi e bocca; zoom: "eyes" / "mouth" per le anteprime dell'editor
export function Avatar({ a, mood, zoom, className = '' }) {
  const { bg, pin } = full(a)
  return (
    <span className={`avatar ${className}`} style={{ background: SLOTS.bg.options[bg].color }}>
      <img src={avatarUri(a, mood, zoom)} alt="" />
      {pin !== 'nessuna' && <img className="pin" src={`https://flagcdn.com/w40/${pin}.png`} alt="" />}
    </span>
  )
}
