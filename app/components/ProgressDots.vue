<script setup lang="ts">
interface Props {
  total: number
  current: number
  /** Optional list of "completed" indexes for filled style */
  completed?: number[]
}

const props = withDefaults(defineProps<Props>(), { completed: () => [] })

const dots = computed(() => {
  const arr: { state: 'done' | 'current' | 'todo' }[] = []
  for (let i = 0; i < props.total; i++) {
    if (i === props.current) arr.push({ state: 'current' })
    else if (props.completed.includes(i)) arr.push({ state: 'done' })
    else arr.push({ state: 'todo' })
  }
  return arr
})
</script>

<template>
  <div class="flex flex-wrap gap-1.5 justify-center">
    <span
      v-for="(d, i) in dots"
      :key="i"
      class="rounded-full transition-all duration-300"
      :class="{
        'w-6 h-2.5 bg-sun-400 shadow-md shadow-sun-300/60': d.state === 'current',
        'w-2.5 h-2.5 bg-emerald-400': d.state === 'done',
        'w-2.5 h-2.5 bg-slate-300': d.state === 'todo',
      }"
    />
  </div>
</template>
