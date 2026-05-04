/**
 * Quiz specifications — translates each lesson's data into a uniform shape
 * that QuizCard can consume. The runner page (/kuis/[tahap]) just looks up
 * the spec by route param.
 */
import { letters } from './letters'
import { syllables } from './syllables'
import { words } from './words'
import { sentences } from './sentences'

export interface QuizItem {
  /** Stable identity — used as option id and for de-duplication */
  id: string
  /** What gets spoken when the question plays */
  audioText: string
  /** Optional sequence for syllable-by-syllable playback */
  audioParts?: string[]
  /** Visible label inside the option button */
  label: string
}

export interface QuizSpec {
  title: string
  description: string
  /** Long sentence options need vertical layout to avoid cramped wrapping */
  layout: 'grid' | 'stack'
  items: QuizItem[]
}

export const QUIZ_SPECS: Record<string, QuizSpec> = {
  huruf: {
    title: 'Kuis Huruf',
    description: 'Dengar bunyi huruf, lalu pilih huruf yang benar.',
    layout: 'grid',
    items: letters.map((l) => ({
      id: l.upper,
      audioText: l.sound,
      label: l.upper,
    })),
  },
  'suku-kata': {
    title: 'Kuis Suku Kata',
    description: 'Dengar suku kata, lalu pilih tulisannya.',
    layout: 'grid',
    items: syllables.flatMap((g) =>
      g.syllables.map((s) => ({ id: s, audioText: s, label: s })),
    ),
  },
  kata: {
    title: 'Kuis Kata',
    description: 'Dengar kata, lalu pilih tulisan yang cocok.',
    layout: 'grid',
    items: words.map((w) => ({
      id: w.text,
      audioText: w.text,
      audioParts: w.parts,
      label: w.text,
    })),
  },
  kalimat: {
    title: 'Kuis Kalimat',
    description: 'Dengar kalimat, lalu pilih tulisan yang cocok.',
    layout: 'stack',
    items: sentences.map((s) => ({
      id: s.text,
      audioText: s.text,
      label: s.text,
    })),
  },
}
