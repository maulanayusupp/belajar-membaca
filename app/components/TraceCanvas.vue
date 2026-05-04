<script setup lang="ts">
/**
 * Canvas latihan trace huruf.
 *
 * Dua canvas ditumpuk:
 *  - templateCanvas: render huruf sekali, transparan/abu-abu — sebagai panduan
 *  - userCanvas:     tempat anak menggambar di atasnya (pointer events)
 *
 * Pakai Pointer Events (API tunggal yg seragam untuk mouse, sentuhan, stylus).
 * `touch-action: none` mencegah scroll saat menggambar di tablet/HP.
 *
 * Scoring: bandingkan pixel demi pixel antara mask huruf (alpha > 0) dengan
 * yang sudah dicat user — `coverage = painted_in_letter / letter_total_pixels`.
 * Kami sengaja TIDAK menghukum kalau anak menggambar di luar garis — fokus ke
 * apakah bentuk huruf "tertutup" oleh goresan mereka.
 */
interface Props {
  /** Karakter yang akan ditrace, mis. "A". Bisa multi-char tapi UI didesain 1 huruf. */
  letter: string
  /** Resolusi internal canvas (px). Default 600 — kualitas oke, performa cepat. */
  size?: number
}

const props = withDefaults(defineProps<Props>(), { size: 600 })
const emit = defineEmits<{ score: [coverage: number] }>()

const templateRef = ref<HTMLCanvasElement | null>(null)
const userRef = ref<HTMLCanvasElement | null>(null)
const drawing = ref(false)
const hasStrokes = ref(false)

let userCtx: CanvasRenderingContext2D | null = null

const STROKE_WIDTH = 28

function renderTemplate() {
  const t = templateRef.value
  if (!t) return
  const ctx = t.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, props.size, props.size)
  // Light gray template letter — tebal supaya kids punya area trace yang lega.
  ctx.fillStyle = 'rgba(203, 213, 225, 1)' // slate-300
  ctx.font = `900 ${Math.floor(props.size * 0.85)}px "Baloo 2", "Fredoka", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.letter, props.size / 2, props.size / 2 + props.size * 0.04)
}

function setupUserCanvas() {
  const u = userRef.value
  if (!u) return
  userCtx = u.getContext('2d', { willReadFrequently: true })
  if (!userCtx) return
  userCtx.lineWidth = STROKE_WIDTH
  userCtx.lineCap = 'round'
  userCtx.lineJoin = 'round'
  userCtx.strokeStyle = '#fb7185' // rose-400 — kontras dengan template abu-abu
}

onMounted(() => {
  renderTemplate()
  setupUserCanvas()
})

watch(
  () => props.letter,
  () => {
    renderTemplate()
    clear()
  },
)

function getPos(e: PointerEvent): { x: number; y: number } {
  const c = userRef.value!
  const rect = c.getBoundingClientRect()
  const scaleX = props.size / rect.width
  const scaleY = props.size / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

function start(e: PointerEvent) {
  if (!userCtx) return
  e.preventDefault()
  drawing.value = true
  hasStrokes.value = true
  const { x, y } = getPos(e)
  userCtx.beginPath()
  userCtx.moveTo(x, y)
  // Titik kecil supaya tap-and-release tetap menghasilkan dot.
  userCtx.lineTo(x + 0.01, y + 0.01)
  userCtx.stroke()
  userRef.value?.setPointerCapture(e.pointerId)
}

function move(e: PointerEvent) {
  if (!drawing.value || !userCtx) return
  const { x, y } = getPos(e)
  userCtx.lineTo(x, y)
  userCtx.stroke()
}

function end(e: PointerEvent) {
  drawing.value = false
  if (e.pointerId != null) {
    try {
      userRef.value?.releasePointerCapture(e.pointerId)
    } catch {
      // pointer mungkin sudah dilepas — abaikan
    }
  }
}

function clear() {
  if (!userCtx) return
  userCtx.clearRect(0, 0, props.size, props.size)
  hasStrokes.value = false
}

/**
 * Skor 0..1 — proporsi pixel huruf yang sudah dicat user.
 * Render ulang mask huruf di canvas offscreen dengan font yang sama,
 * lalu bandingkan alpha-nya dengan canvas user.
 */
function check(): number {
  if (!userCtx || !userRef.value) return 0
  const off = document.createElement('canvas')
  off.width = props.size
  off.height = props.size
  const oc = off.getContext('2d', { willReadFrequently: true })!
  oc.fillStyle = '#000000'
  oc.font = `900 ${Math.floor(props.size * 0.85)}px "Baloo 2", "Fredoka", system-ui, sans-serif`
  oc.textAlign = 'center'
  oc.textBaseline = 'middle'
  oc.fillText(props.letter, props.size / 2, props.size / 2 + props.size * 0.04)

  const ideal = oc.getImageData(0, 0, props.size, props.size).data
  const user = userCtx.getImageData(0, 0, props.size, props.size).data

  let total = 0
  let painted = 0
  // Cek setiap pixel ke-N (loncat 2px) agar lebih cepat — cukup akurat utk skoring kasar.
  for (let i = 3; i < ideal.length; i += 4 * 2) {
    if (ideal[i]! > 32) {
      total++
      if (user[i]! > 32) painted++
    }
  }
  const coverage = total ? painted / total : 0
  emit('score', coverage)
  return coverage
}

defineExpose({ clear, check, hasStrokes })
</script>

<template>
  <div
    class="relative w-full aspect-square max-w-md mx-auto rounded-3xl bg-white shadow-inner ring-2 ring-slate-200 overflow-hidden"
  >
    <canvas
      ref="templateRef"
      :width="size"
      :height="size"
      class="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
    <canvas
      ref="userRef"
      :width="size"
      :height="size"
      class="absolute inset-0 w-full h-full cursor-crosshair"
      style="touch-action: none;"
      :aria-label="`Area menulis huruf ${letter}`"
      @pointerdown="start"
      @pointermove="move"
      @pointerup="end"
      @pointercancel="end"
      @pointerleave="end"
    />
  </div>
</template>
