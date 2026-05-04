/**
 * Indonesian-only Text-to-Speech using the browser's Web Speech API.
 *
 * Strict policy: an utterance is spoken ONLY when an Indonesian voice is
 * detected. If the device has no Indonesian voice installed we stay silent
 * rather than mispronouncing in English — the UI shows a warning banner
 * driven by `hasIndonesianVoice`.
 *
 * Known Indonesian voices we accept:
 *   - Any voice with lang matching id / id-ID / id_ID
 *   - macOS:   "Damayanti"
 *   - Chrome:  "Google Bahasa Indonesia"
 *   - Windows: "Microsoft Andika", "Microsoft Gadis"
 *   - Android: "Bahasa Indonesia" / "Indonesia"
 *
 * State is module-scoped so every component shares the same voice list and
 * detection flag — no duplicate work, no race between mounted hooks.
 */

const supported = ref(false)
const ready = ref(false)
const speaking = ref(false)
const voice = ref<SpeechSynthesisVoice | null>(null)
const hasIndonesianVoice = ref(false)
let initialized = false

/**
 * Global speed multiplier — applied on top of each call's own `rate`.
 * 0.7 = pelan, 1.0 = normal, 1.3 = cepat.
 * Persisted to localStorage so kids don't have to re-pick every visit.
 */
const SPEED_KEY = 'belajar-membaca:speed:v1'
const speedMultiplier = ref(1.0)

function loadSpeed() {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(SPEED_KEY)
  const n = Number(raw)
  if (n > 0 && n < 3) speedMultiplier.value = n
}

function setSpeed(v: number) {
  speedMultiplier.value = v
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SPEED_KEY, String(v))
    } catch {
      // quota / disabled — ignore
    }
  }
}

const NAME_PATTERNS = [
  /damayanti/i,
  /bahasa\s*indonesia/i,
  /indonesian/i,
  /\bandika\b/i,
  /\bgadis\b/i,
]

function isIndonesian(v: SpeechSynthesisVoice): boolean {
  const lang = (v.lang || '').toLowerCase().replace('_', '-')
  if (lang === 'id' || lang.startsWith('id-')) return true
  return NAME_PATTERNS.some((re) => re.test(v.name))
}

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return
  const id = voices.find(isIndonesian) || null
  voice.value = id
  hasIndonesianVoice.value = !!id
  ready.value = true
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  if (!('speechSynthesis' in window)) return
  initialized = true
  supported.value = true
  loadSpeed()
  pickVoice()
  // Voices load asynchronously on Chrome/Edge — re-pick when they arrive.
  window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
}

export function useSpeech() {
  onMounted(ensureInit)

  /**
   * Speak the given text in Indonesian. Resolves silently when no Indonesian
   * voice is available — callers don't need to special-case this.
   */
  function speak(
    text: string,
    opts: { rate?: number; pitch?: number; volume?: number } = {},
  ): Promise<void> {
    if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve()
    if (!voice.value) return Promise.resolve()

    return new Promise((resolve) => {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.voice = voice.value!
      u.lang = voice.value!.lang || 'id-ID'
      // Per-call rate × global speed multiplier. Clamp to engine-safe range.
      const finalRate = (opts.rate ?? 0.9) * speedMultiplier.value
      u.rate = Math.min(Math.max(finalRate, 0.4), 2.0)
      u.pitch = opts.pitch ?? 1.15
      u.volume = opts.volume ?? 1
      u.onstart = () => (speaking.value = true)
      u.onend = () => {
        speaking.value = false
        resolve()
      }
      u.onerror = () => {
        speaking.value = false
        resolve()
      }
      window.speechSynthesis.speak(u)
    })
  }

  function stop() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    speaking.value = false
  }

  /** Speak a sequence with small gaps — good for syllable-by-syllable reading. */
  async function speakSequence(parts: string[], gapMs = 250) {
    for (const p of parts) {
      await speak(p)
      if (gapMs) await new Promise((r) => setTimeout(r, gapMs))
    }
  }

  return {
    supported,
    ready,
    speaking,
    voice,
    hasIndonesianVoice,
    speedMultiplier,
    setSpeed,
    speak,
    speakSequence,
    stop,
  }
}
