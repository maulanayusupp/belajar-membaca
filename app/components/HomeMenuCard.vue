<script setup lang="ts">
interface Props {
  to: string
  step: string
  title: string
  description: string
  emoji: string
  /** Tailwind gradient classes, e.g. "from-rose-300 to-pink-400" */
  color: string
  /** Animation delay for staggered entrance */
  delay?: number
}

const props = withDefaults(defineProps<Props>(), { delay: 0 })

const styleVars = computed(() => ({ animationDelay: `${props.delay}ms` }))
</script>

<template>
  <NuxtLink
    :to="to"
    :style="styleVars"
    class="group relative block animate-pop-in card-soft p-5 sm:p-6 hover:-translate-y-1 transition-transform"
  >
    <div
      class="absolute inset-0 -z-10 rounded-3xl opacity-70 bg-gradient-to-br blur-md"
      :class="color"
    />
    <div
      class="rounded-3xl p-5 sm:p-6 text-white bg-gradient-to-br shadow-inner"
      :class="color"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-widest font-semibold opacity-80">
            {{ step }}
          </p>
          <h2 class="heading-fun text-2xl sm:text-3xl mt-1 drop-shadow-sm">{{ title }}</h2>
        </div>
        <span class="text-5xl sm:text-6xl group-hover:animate-wiggle drop-shadow-lg">
          {{ emoji }}
        </span>
      </div>
      <p class="mt-3 text-sm sm:text-base leading-relaxed opacity-95">
        {{ description }}
      </p>
      <div class="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div class="inline-flex items-center gap-1.5 text-sm font-bold">
          Mulai
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <!-- Optional badge slot — kuis index uses this for "Terbaik: 8/10" -->
        <slot name="badge" />
      </div>
    </div>
  </NuxtLink>
</template>
