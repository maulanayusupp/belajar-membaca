import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/plugins/**/*.{js,ts}',
    // Penting: data/*.ts berisi string class (warna gradient untuk kartu,
    // achievement, dll). Tanpa scan ini, Tailwind tidak akan generate kelas
    // yang cuma muncul di file data — gradient toast/lencana akan kosong.
    './app/data/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Fredoka', 'system-ui', 'sans-serif'],
      },
      colors: {
        sun: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        bubble: {
          pink: '#ff7eb3',
          purple: '#a78bfa',
          blue: '#60a5fa',
          mint: '#5eead4',
          lemon: '#facc15',
          coral: '#fb7185',
        },
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.5) rotate(-12deg)', opacity: '0' },
          '70%': { transform: 'scale(1.08) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        bounceSoft: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sparkle: {
          '0%,100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'scale(1.3) rotate(180deg)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0)', opacity: '1' },
          '100%': { transform: 'translateY(120vh) rotate(720deg)', opacity: '0' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(251,191,36,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(251,191,36,0.8)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1.2s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
}
