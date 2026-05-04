/**
 * Daily streak tracker.
 *
 * Setiap kali anak melakukan aksi bermakna (selesaikan satu materi, kuis,
 * atau trace huruf), `recordVisit()` dipanggil. Logikanya:
 *   - Sudah dicatat hari ini  → tidak ada perubahan
 *   - Selisih persis 1 hari   → streak += 1
 *   - Selisih > 1 hari        → streak reset ke 1
 *
 * Pakai string `YYYY-MM-DD` di local timezone agar tidak terganggu DST.
 *
 * State tersimpan di localStorage `belajar-membaca:streak:v1`.
 * Catatan: localStorage tidak punya auto-expire — kalau Safari ITP
 * menghapus data setelah 7 hari tak ada interaksi, streak otomatis
 * reset, yang justru sesuai dengan semantik "streak putus".
 */
const STORAGE_KEY = 'belajar-membaca:streak:v1'

interface StreakState {
  current: number
  longest: number
  /** YYYY-MM-DD di local timezone */
  lastPlayDate: string
}

const state = ref<StreakState>({ current: 0, longest: 0, lastPlayDate: '' })
let loaded = false

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) state.value = { current: 0, longest: 0, lastPlayDate: '', ...JSON.parse(raw) }
  } catch {
    // ignore
  }
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  } catch {
    // quota / disabled — ignore
  }
}

function todayLocalISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysBetween(a: string, b: string): number {
  // Parse keduanya sebagai midnight local — selisih dalam hari kalender.
  const ad = new Date(`${a}T00:00:00`)
  const bd = new Date(`${b}T00:00:00`)
  return Math.round((bd.getTime() - ad.getTime()) / 86400000)
}

export function useStreak() {
  if (typeof window !== 'undefined') load()

  /** Tandai bahwa anak aktif hari ini. Aman dipanggil berkali-kali per hari. */
  function recordVisit(): { changed: boolean; current: number } {
    const today = todayLocalISO()
    if (state.value.lastPlayDate === today) {
      return { changed: false, current: state.value.current }
    }

    const last = state.value.lastPlayDate
    let nextCurrent: number
    if (!last) {
      nextCurrent = 1
    } else {
      const gap = daysBetween(last, today)
      nextCurrent = gap === 1 ? state.value.current + 1 : 1
    }

    state.value = {
      current: nextCurrent,
      longest: Math.max(state.value.longest, nextCurrent),
      lastPlayDate: today,
    }
    persist()
    return { changed: true, current: nextCurrent }
  }

  /** Tampilan: apakah streak masih "hidup" (terakhir main hari ini atau kemarin). */
  function isActive(): boolean {
    if (!state.value.lastPlayDate) return false
    const gap = daysBetween(state.value.lastPlayDate, todayLocalISO())
    return gap <= 1
  }

  function reset() {
    state.value = { current: 0, longest: 0, lastPlayDate: '' }
    persist()
  }

  return {
    state,
    current: computed(() => state.value.current),
    longest: computed(() => state.value.longest),
    lastPlayDate: computed(() => state.value.lastPlayDate),
    isActive,
    recordVisit,
    reset,
  }
}
