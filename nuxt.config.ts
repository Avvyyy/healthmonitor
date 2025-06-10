// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700]
    }
  },
  ui: {
    global: true,
    icons: ['heroicons', 'lucide']
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
      websocketUrl: process.env.NUXT_PUBLIC_WEBSOCKET_URL || 'wss://healthm0nitor.onrender.com',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://healthm0nitor.onrender.com'
    }
  },
  nitro: {
    preset: 'netlify'
  },
  ssr: true
})