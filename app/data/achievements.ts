/**
 * Daftar badge achievement.
 *
 * Setiap badge punya `check()` yang dipanggil saat `checkAndUnlock()`
 * dijalankan. Check function memanggil composable lain langsung — aman
 * karena semua state-nya module-scoped (singleton).
 */
import { letters } from './letters'
import { syllables } from './syllables'
import { words } from './words'
import { sentences } from './sentences'

export interface AchievementDef {
  id: string
  title: string
  description: string
  emoji: string
  /** Tailwind gradient untuk badge yang sudah unlocked */
  color: string
  /** Return true berarti sudah terbuka */
  check: () => boolean
}

/** Hitung total quiz plays di semua kategori (untuk badge marathon). */
function totalQuizPlays(): number {
  if (typeof window === 'undefined') return 0
  const { scores } = useQuizScores()
  return Object.values(scores.value).reduce((sum, s) => sum + (s?.plays ?? 0), 0)
}

function bestQuizScore(): number {
  if (typeof window === 'undefined') return 0
  const { scores } = useQuizScores()
  let best = 0
  for (const s of Object.values(scores.value)) {
    if (!s) continue
    const ratio = s.total ? s.best / s.total : 0
    if (ratio > best) best = ratio
  }
  return best
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // === Tahap belajar ===
  {
    id: 'first-letter',
    title: 'Langkah Pertama',
    description: 'Selesaikan huruf pertamamu',
    emoji: '🌱',
    color: 'from-lime-400 to-emerald-500',
    check: () => useProgress('letters').completed.value.length >= 1,
  },
  {
    id: 'half-alphabet',
    title: 'Setengah Jalan',
    description: 'Selesaikan 13 huruf',
    emoji: '🌿',
    color: 'from-emerald-400 to-teal-500',
    check: () => useProgress('letters').completed.value.length >= 13,
  },
  {
    id: 'alphabet-master',
    title: 'Penguasa Alfabet',
    description: 'Selesaikan semua 26 huruf',
    emoji: '🔤',
    color: 'from-rose-400 to-pink-500',
    check: () => useProgress('letters').completed.value.length >= letters.length,
  },
  {
    id: 'syllable-explorer',
    title: 'Penjelajah Suku Kata',
    description: 'Selesaikan semua grup suku kata',
    emoji: '🎵',
    color: 'from-sky-400 to-blue-500',
    check: () => useProgress('syllables').completed.value.length >= syllables.length,
  },
  {
    id: 'word-wizard',
    title: 'Ahli Kata',
    description: 'Selesaikan semua kata',
    emoji: '📖',
    color: 'from-amber-400 to-orange-500',
    check: () => useProgress('words').completed.value.length >= words.length,
  },
  {
    id: 'sentence-reader',
    title: 'Pembaca Kalimat',
    description: 'Selesaikan semua kalimat',
    emoji: '📚',
    color: 'from-violet-400 to-purple-500',
    check: () => useProgress('sentences').completed.value.length >= sentences.length,
  },

  // === Kuis ===
  {
    id: 'quiz-rookie',
    title: 'Kuis Pemula',
    description: 'Mainkan kuis pertamamu',
    emoji: '🎯',
    color: 'from-fuchsia-400 to-pink-500',
    check: () => totalQuizPlays() >= 1,
  },
  {
    id: 'quiz-marathon',
    title: 'Maraton Kuis',
    description: 'Mainkan kuis 10 kali',
    emoji: '🏃',
    color: 'from-orange-400 to-red-500',
    check: () => totalQuizPlays() >= 10,
  },
  {
    id: 'quiz-perfect',
    title: 'Skor Sempurna',
    description: 'Dapatkan 100% di kuis manapun',
    emoji: '💯',
    color: 'from-yellow-400 to-amber-500',
    check: () => bestQuizScore() >= 1,
  },

  // === Streak ===
  {
    id: 'streak-3',
    title: 'Tiga Hari Berturut',
    description: 'Main 3 hari berturut-turut',
    emoji: '🔥',
    color: 'from-orange-400 to-rose-500',
    check: () => useStreak().longest.value >= 3,
  },
  {
    id: 'streak-7',
    title: 'Pejuang Mingguan',
    description: 'Main 7 hari berturut-turut',
    emoji: '🌟',
    color: 'from-amber-400 to-orange-600',
    check: () => useStreak().longest.value >= 7,
  },

  // === Latihan menulis ===
  {
    id: 'trace-first',
    title: 'Goresan Pertama',
    description: 'Lulus latihan menulis huruf pertamamu',
    emoji: '✏️',
    color: 'from-cyan-400 to-sky-500',
    check: () => useProgress('tracing-letters').completed.value.length >= 1,
  },
  {
    id: 'trace-master',
    title: 'Master Tulisan',
    description: 'Lulus latihan menulis 10 huruf',
    emoji: '✍️',
    color: 'from-blue-400 to-indigo-500',
    check: () => useProgress('tracing-letters').completed.value.length >= 10,
  },

  // === Kombinasi ===
  {
    id: 'all-rounder',
    title: 'Serba Bisa',
    description: 'Selesaikan keempat tahap belajar',
    emoji: '🏆',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    check: () => {
      return (
        useProgress('letters').completed.value.length >= letters.length &&
        useProgress('syllables').completed.value.length >= syllables.length &&
        useProgress('words').completed.value.length >= words.length &&
        useProgress('sentences').completed.value.length >= sentences.length
      )
    },
  },
]
