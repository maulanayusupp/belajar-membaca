/**
 * Mapping `tahap` route key → metadata yang dipakai oleh sertifikat dan
 * halaman lainnya. Sumber kebenaran tunggal supaya judul/tahap konsisten.
 */
import { letters } from './letters'
import { syllables } from './syllables'
import { words } from './words'
import { sentences } from './sentences'

export interface LessonMeta {
  /** localStorage key used by useProgress (lihat lesson page masing-masing) */
  progressKey: string
  /** Path ke halaman lesson */
  lessonPath: string
  /** Judul yang ditampilkan di sertifikat */
  certTitle: string
  /** Total item di tahap ini — untuk gating completion */
  total: number
}

export const LESSON_META: Record<string, LessonMeta> = {
  huruf: {
    progressKey: 'letters',
    lessonPath: '/huruf',
    certTitle: 'Tahap 1: Huruf A sampai Z',
    total: letters.length,
  },
  'suku-kata': {
    progressKey: 'syllables',
    lessonPath: '/suku-kata',
    certTitle: 'Tahap 2: Suku Kata',
    total: syllables.length,
  },
  kata: {
    progressKey: 'words',
    lessonPath: '/kata',
    certTitle: 'Tahap 3: Kata',
    total: words.length,
  },
  kalimat: {
    progressKey: 'sentences',
    lessonPath: '/kalimat',
    certTitle: 'Tahap 4: Kalimat',
    total: sentences.length,
  },
}

const ID_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export function formatDateID(d = new Date()): string {
  return `${d.getDate()} ${ID_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
