export interface Letter {
  /** Uppercase form */
  upper: string
  /** Lowercase form */
  lower: string
  /** Bunyi huruf (phonetic spoken sound, not letter name) */
  sound: string
  /** Example word starting with the letter */
  example: string
  /** Emoji visual cue */
  emoji: string
  /** Saturated gradient for the card background — strong enough to keep white text readable */
  color: string
}

export const letters: Letter[] = [
  { upper: 'A', lower: 'a', sound: 'a',    example: 'Apel',   emoji: '🍎', color: 'from-rose-400 to-rose-600' },
  { upper: 'B', lower: 'b', sound: 'beh',  example: 'Bola',   emoji: '⚽', color: 'from-sky-400 to-blue-600' },
  { upper: 'C', lower: 'c', sound: 'ceh',  example: 'Cabai',  emoji: '🌶️', color: 'from-red-400 to-rose-600' },
  { upper: 'D', lower: 'd', sound: 'deh',  example: 'Domba',  emoji: '🐑', color: 'from-amber-400 to-orange-600' },
  { upper: 'E', lower: 'e', sound: 'e',    example: 'Elang',  emoji: '🦅', color: 'from-orange-400 to-red-600' },
  { upper: 'F', lower: 'f', sound: 'ef',   example: 'Foto',   emoji: '📷', color: 'from-pink-400 to-rose-600' },
  { upper: 'G', lower: 'g', sound: 'geh',  example: 'Gajah',  emoji: '🐘', color: 'from-slate-400 to-slate-600' },
  { upper: 'H', lower: 'h', sound: 'ha',   example: 'Hidung', emoji: '👃', color: 'from-rose-400 to-pink-600' },
  { upper: 'I', lower: 'i', sound: 'i',    example: 'Ikan',   emoji: '🐟', color: 'from-cyan-400 to-sky-600' },
  { upper: 'J', lower: 'j', sound: 'jeh',  example: 'Jeruk',  emoji: '🍊', color: 'from-orange-400 to-amber-600' },
  { upper: 'K', lower: 'k', sound: 'ka',   example: 'Kucing', emoji: '🐱', color: 'from-amber-400 to-yellow-600' },
  { upper: 'L', lower: 'l', sound: 'el',   example: 'Lebah',  emoji: '🐝', color: 'from-amber-400 to-orange-600' },
  { upper: 'M', lower: 'm', sound: 'em',   example: 'Mama',   emoji: '👩', color: 'from-pink-400 to-fuchsia-600' },
  { upper: 'N', lower: 'n', sound: 'en',   example: 'Nasi',   emoji: '🍚', color: 'from-stone-400 to-stone-600' },
  { upper: 'O', lower: 'o', sound: 'o',    example: 'Obat',   emoji: '💊', color: 'from-red-400 to-rose-600' },
  { upper: 'P', lower: 'p', sound: 'peh',  example: 'Pisang', emoji: '🍌', color: 'from-amber-400 to-yellow-600' },
  { upper: 'Q', lower: 'q', sound: 'ki',   example: 'Quran',  emoji: '📖', color: 'from-emerald-400 to-teal-600' },
  { upper: 'R', lower: 'r', sound: 'er',   example: 'Roti',   emoji: '🍞', color: 'from-amber-400 to-orange-600' },
  { upper: 'S', lower: 's', sound: 'es',   example: 'Susu',   emoji: '🥛', color: 'from-slate-400 to-zinc-600' },
  { upper: 'T', lower: 't', sound: 'teh',  example: 'Topi',   emoji: '🎩', color: 'from-zinc-400 to-slate-600' },
  { upper: 'U', lower: 'u', sound: 'u',    example: 'Ulat',   emoji: '🐛', color: 'from-lime-400 to-green-600' },
  { upper: 'V', lower: 'v', sound: 'feh',  example: 'Vas',    emoji: '🏺', color: 'from-violet-400 to-purple-600' },
  { upper: 'W', lower: 'w', sound: 'weh',  example: 'Wortel', emoji: '🥕', color: 'from-orange-400 to-red-600' },
  { upper: 'X', lower: 'x', sound: 'eks',  example: 'Xilofon', emoji: '🎼', color: 'from-purple-400 to-indigo-600' },
  { upper: 'Y', lower: 'y', sound: 'yeh',  example: 'Yoyo',   emoji: '🪀', color: 'from-fuchsia-400 to-pink-600' },
  { upper: 'Z', lower: 'z', sound: 'zet',  example: 'Zebra',  emoji: '🦓', color: 'from-neutral-500 to-neutral-700' },
]
