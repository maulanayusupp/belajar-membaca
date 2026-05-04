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
  try {
    const raw = localStorage.getItem(SPEED_KEY)
    const n = Number(raw)
    if (n > 0 && n < 3) speedMultiplier.value = n
  } catch {
    // localStorage diakses dilarang (private mode, dll) — pakai default
  }
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

/** Total voices terdeteksi — untuk diagnostik di banner */
const voiceCount = ref(0)
/** Semua voice Indonesia yang terdeteksi — untuk selector manual di banner */
const indonesianVoices = ref<SpeechSynthesisVoice[]>([])
/** Override pilihan user (disimpan di localStorage) */
const VOICE_KEY = 'belajar-membaca:voice-name:v1'

function loadVoicePreference(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(VOICE_KEY)
  } catch {
    return null
  }
}

function saveVoicePreference(name: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(VOICE_KEY, name)
  } catch {
    // ignore
  }
}

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const voices = window.speechSynthesis.getVoices()
  voiceCount.value = voices.length
  if (!voices.length) return
  const allID = voices.filter(isIndonesian)
  indonesianVoices.value = allID

  // Prioritas: pilihan user (jika disimpan & masih ada) → Google online voices
  // (paling andal) → voice lokal pertama → null.
  const preferred = loadVoicePreference()
  const id =
    (preferred && allID.find((v) => v.name === preferred)) ||
    allID.find((v) => /google/i.test(v.name)) ||
    allID.find((v) => v.localService === false) ||
    allID[0] ||
    null
  voice.value = id
  hasIndonesianVoice.value = !!id
  ready.value = true
}

function setVoice(name: string) {
  const v = indonesianVoices.value.find((x) => x.name === name)
  if (!v) return
  voice.value = v
  saveVoicePreference(name)
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  if (!('speechSynthesis' in window)) return
  initialized = true
  supported.value = true
  // Setiap step di-try terpisah — kalau loadSpeed throw, voice detection
  // tetap jalan, dan sebaliknya. Tujuannya: audio tetap bunyi walau salah
  // satu side-effect bermasalah.
  try {
    loadSpeed()
  } catch {
    // ignore
  }
  try {
    pickVoice()
  } catch {
    // ignore
  }
  // Polling fallback: di Chrome, `voiceschanged` event kadang tidak fire
  // walaupun voices sebenarnya sudah loaded. Poll setiap 200ms sampai voice
  // terdeteksi atau timeout (4 detik), tanpa mengganggu performa.
  if (!voice.value) {
    let attempts = 0
    const interval = setInterval(() => {
      try {
        pickVoice()
      } catch {
        // ignore
      }
      attempts++
      if (voice.value || attempts >= 20) clearInterval(interval)
    }, 200)
  }
  try {
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
  } catch {
    // ignore
  }
}

export function useSpeech() {
  onMounted(ensureInit)

  /**
   * Speak the given text in Indonesian. Resolves silently when no Indonesian
   * voice is available — callers don't need to special-case this.
   *
   * Kalau voice belum sempat terdeteksi (user klik tombol cepat banget),
   * akan tunggu max 1.5 detik sambil polling — daripada langsung diam.
   */
  async function speak(
    text: string,
    opts: { rate?: number; pitch?: number; volume?: number } = {},
  ): Promise<void> {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    // Tunggu voice detect kalau belum siap
    if (!voice.value) {
      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 100))
        if (voice.value) break
      }
    }
    if (!voice.value) return

    // Chrome/Safari bug: cancel() lalu speak() langsung membuat engine
    // membatalkan utterance baru juga, dan rapid click menyebabkan engine
    // masuk state stuck (utterance baru di-accept tapi nggak pernah jalan).
    //
    // Fix: tandai `speaking=true` SEKARANG (sebelum await), supaya UI yang
    // pakai `:disabled="speaking"` langsung men-disable tombol & cegah
    // user klik lagi selama engine warmup. Beri delay 200ms setelah cancel
    // (60ms tidak cukup di macOS Safari/Chrome).
    speaking.value = true
    const wasSpeaking = window.speechSynthesis.speaking || window.speechSynthesis.pending
    if (wasSpeaking) {
      window.speechSynthesis.cancel()
      await new Promise((r) => setTimeout(r, 200))
    }

    // Chrome bug: setelah idle / cancel, engine kadang dalam state "paused"
    // yang menyebabkan setiap speak fire onerror "canceled" instan. Resume
    // dulu — no-op kalau memang tidak paused.
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
    } catch {
      // ignore
    }

    return new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(text)
      u.voice = voice.value!
      u.lang = voice.value!.lang || 'id-ID'
      // Per-call rate × global speed multiplier. Clamp to engine-safe range.
      const finalRate = (opts.rate ?? 0.9) * speedMultiplier.value
      u.rate = Math.min(Math.max(finalRate, 0.4), 2.0)
      u.pitch = opts.pitch ?? 1.15
      u.volume = opts.volume ?? 1

      // Safety timeout — kalau onstart/onend nggak pernah fire (browser
      // silently reject), Promise tetap resolve setelah 10 detik biar
      // pemanggil tidak hang.
      const safety = setTimeout(() => {
        speaking.value = false
        resolve()
      }, 10000)

      u.onstart = () => (speaking.value = true)
      u.onend = () => {
        clearTimeout(safety)
        speaking.value = false
        resolve()
      }
      u.onerror = () => {
        clearTimeout(safety)
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
    voiceCount,
    indonesianVoices,
    hasIndonesianVoice,
    setVoice,
    speedMultiplier,
    setSpeed,
    speak,
    speakSequence,
    stop,
  }
}
