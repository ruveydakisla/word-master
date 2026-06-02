/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    // --- Arka Plan Renkleri (Düz ve Opaklıklar) ---
    'bg-red-50',
    'border-red-100/50',
    'text-red-500', // İkon veya yazı rengi için koruma
    'bg-purple-50',
    'bg-amber-50',
    'border-amber-200/50',
    'text-amber-700',
    'bg-[#f8fafc]',
    'bg-amber-100',
    'bg-background',
    'bg-blue-50',
    'bg-brightChrome',
    'bg-cello',
    'bg-cello/10',
    'bg-emerald-200/20',
    'bg-emerald-200/30',
    'bg-emerald-500',
    'bg-emerald-500/10',
    'bg-gray-50',
    'bg-gray-100',
    'bg-green-50',
    'bg-pink-50',
    'bg-purple-100',
    'bg-purple-200/30',
    'bg-purple-200/40',
    'bg-purple-50',
    'bg-red-50',
    'bg-red-50/60',
    'bg-red-500',
    'bg-secondary/10',
    'bg-white',
    'bg-white/20',
    'bg-white/80',
    'bg-white/90',

    // --- Yazı Renkleri ---
    'text-cello',
    'text-cello/60',
    'text-emerald-700',
    'text-purple-700',
    'text-red-500',
    'text-secondary',
    'text-white',

    // --- Kenarlık Renkleri ---
    'border-blue-100/30',
    'border-cello',
    'border-cello/5',
    'border-emerald-500/10',
    'border-emerald-500/20',
    'border-gray-100',
    'border-gray-100/70',
    'border-green-100/30',
    'border-green-600',
    'border-red-100',
    'border-red-500',
    'border-red-600',
    'border-white/20',

    // --- Gradyan Tetikleyicileri ve Yönleri ---
    'bg-gradient-to-b',
    'bg-gradient-to-r',
    'bg-gradient-to-tr',

    // --- Gradyan Renk Kombinasyonları ---
    'from-[#f4f7f6]',
    'from-cello',
    'from-purple-500',
    'to-[#2b5884]',
    'to-[#e9eff1]',
    'to-emerald-400',
    'to-purple-600',
    'via-[#254d71]',
    'via-cello',

    // --- Efektler, Opaklık ve Animasyonlar ---
    'animate-ping',
    'animate-pulse',
    'blur-3xl',
    'opacity-30',
    'pointer-events-none',
    'space-y-12',

    // --- Dokunma Hissiyatı (Active) ve Ölçekleme ---
    'active:scale-[0.96]',
    'active:scale-[0.99]',
    'active:scale-90',
    'active:scale-95',

    // --- Gölgeler (Shadows) ---
    'shadow-2xl',
    'shadow-cello/10',
    'shadow-cello/15',
    'shadow-cello/5',
    'shadow-cello/20',
    'shadow-lg',
    'shadow-md',
    'shadow-purple-600/15',
    'shadow-purple-600/20',
    'shadow-sm',
    'shadow-xl',

    // --- Kenar Ovallikleri (Radius) ---
    'rounded-2xl',
    'rounded-3xl',
    'rounded-[32px]',

    // --- Yazı Kalınlıkları (Font Weights) ---
    'font-bold',
    'font-extrabold',
    'font-black',
    'font-medium',
    'font-normal',
    'font-semibold',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1e3d59', // Koyu Mavi
        secondary: '#4e9f3d', // Yeşil
        accent: '#ffd700', // Altın
        background: '#f5f7fb', // Açık Gri Arka Plan
        cello: '#1e3d59',
        brightChrome: '#f8fafc',
        green: {
          500: '#4e9f3d',
        },
        red: {
          500: '#f87171',
        },
      },
    },
  },
  plugins: [],
};
