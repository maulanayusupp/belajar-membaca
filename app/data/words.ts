export interface Word {
  /** Full word, lowercase */
  text: string
  /** Word split into syllables, e.g. ['ma', 'ma'] */
  parts: string[]
  /** Visual emoji */
  emoji: string
  /** Saturated gradient — bold enough for white text to read on top */
  color: string
}

/**
 * Two-syllable open-vowel words first (KV-KV), then a few mixed.
 * These should match the difficulty path described in the curriculum:
 *   1. KV-KV  (mama, papa)
 *   2. KVK    (closed syllables — bapak, makan)
 */
export const words: Word[] = [
  { text: 'mama',  parts: ['ma', 'ma'],  emoji: '👩',   color: 'from-pink-400 to-rose-600' },
  { text: 'papa',  parts: ['pa', 'pa'],  emoji: '👨',   color: 'from-sky-400 to-blue-600' },
  { text: 'susu',  parts: ['su', 'su'],  emoji: '🥛',   color: 'from-slate-400 to-zinc-600' },
  { text: 'bola',  parts: ['bo', 'la'],  emoji: '⚽',   color: 'from-amber-400 to-orange-600' },
  { text: 'batu',  parts: ['ba', 'tu'],  emoji: '🪨',   color: 'from-stone-400 to-stone-600' },
  { text: 'sapi',  parts: ['sa', 'pi'],  emoji: '🐄',   color: 'from-rose-400 to-pink-600' },
  { text: 'kuda',  parts: ['ku', 'da'],  emoji: '🐴',   color: 'from-amber-400 to-yellow-600' },
  { text: 'gigi',  parts: ['gi', 'gi'],  emoji: '🦷',   color: 'from-cyan-400 to-sky-600' },
  { text: 'topi',  parts: ['to', 'pi'],  emoji: '🎩',   color: 'from-zinc-400 to-slate-600' },
  { text: 'duku',  parts: ['du', 'ku'],  emoji: '🟡',   color: 'from-yellow-500 to-amber-600' },
  // KVK and mixed
  { text: 'makan', parts: ['ma', 'kan'], emoji: '🍚',   color: 'from-orange-400 to-red-600' },
  { text: 'minum', parts: ['mi', 'num'], emoji: '🥤',   color: 'from-sky-400 to-cyan-600' },
  { text: 'tidur', parts: ['ti', 'dur'], emoji: '😴',   color: 'from-indigo-400 to-purple-600' },
  { text: 'rumah', parts: ['ru', 'mah'], emoji: '🏠',   color: 'from-amber-400 to-orange-600' },
  { text: 'badan', parts: ['ba', 'dan'], emoji: '🧒',   color: 'from-rose-400 to-orange-600' },
  { text: 'bapak', parts: ['ba', 'pak'], emoji: '👨‍🦱', color: 'from-blue-400 to-indigo-600' },
]
