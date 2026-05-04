export interface SyllableGroup {
  /** Single consonant — e.g., "b" */
  consonant: string
  /** ba, bi, bu, be, bo */
  syllables: string[]
  /** Saturated gradient backdrop */
  color: string
  /** Friendly emoji that loosely matches the consonant */
  emoji: string
}

const VOWELS = ['a', 'i', 'u', 'e', 'o']

function build(consonant: string): string[] {
  return VOWELS.map((v) => consonant + v)
}

export const syllables: SyllableGroup[] = [
  { consonant: 'b', syllables: build('b'), color: 'from-sky-400 to-blue-600',       emoji: '🐝' },
  { consonant: 'm', syllables: build('m'), color: 'from-pink-400 to-rose-600',      emoji: '🐭' },
  { consonant: 'p', syllables: build('p'), color: 'from-amber-400 to-orange-600',   emoji: '🥞' },
  { consonant: 'n', syllables: build('n'), color: 'from-emerald-400 to-teal-600',   emoji: '🍜' },
  { consonant: 't', syllables: build('t'), color: 'from-orange-400 to-red-600',     emoji: '🐢' },
  { consonant: 's', syllables: build('s'), color: 'from-violet-400 to-purple-600',  emoji: '🐍' },
  { consonant: 'k', syllables: build('k'), color: 'from-lime-400 to-green-600',     emoji: '🐸' },
  { consonant: 'l', syllables: build('l'), color: 'from-fuchsia-400 to-pink-600',   emoji: '🦁' },
  { consonant: 'd', syllables: build('d'), color: 'from-amber-400 to-orange-600',   emoji: '🐶' },
  { consonant: 'r', syllables: build('r'), color: 'from-red-400 to-rose-600',       emoji: '🌹' },
  { consonant: 'g', syllables: build('g'), color: 'from-cyan-400 to-sky-600',       emoji: '🐘' },
  { consonant: 'j', syllables: build('j'), color: 'from-orange-400 to-amber-600',   emoji: '🍊' },
]
