export interface Sentence {
  text: string
  words: string[]
  emoji: string
  color: string
}

/** Simple "Ini ..." / subject-verb-object sentences using vocabulary already learned. */
export const sentences: Sentence[] = [
  { text: 'ini ibu',              words: ['ini', 'ibu'],                     emoji: '👩',   color: 'from-pink-400 to-rose-600' },
  { text: 'itu bola',             words: ['itu', 'bola'],                    emoji: '⚽',   color: 'from-amber-400 to-orange-600' },
  { text: 'budi makan nasi',      words: ['budi', 'makan', 'nasi'],          emoji: '🍚',   color: 'from-yellow-500 to-amber-600' },
  { text: 'sapi minum susu',      words: ['sapi', 'minum', 'susu'],          emoji: '🐄',   color: 'from-sky-400 to-cyan-600' },
  { text: 'kakak baca buku',      words: ['kakak', 'baca', 'buku'],          emoji: '📚',   color: 'from-violet-400 to-indigo-600' },
  { text: 'adik suka apel',       words: ['adik', 'suka', 'apel'],           emoji: '🍎',   color: 'from-rose-400 to-red-600' },
  { text: 'aku pergi ke sekolah', words: ['aku', 'pergi', 'ke', 'sekolah'],  emoji: '🎒',   color: 'from-emerald-400 to-teal-600' },
]
