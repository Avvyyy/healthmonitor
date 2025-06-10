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
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || ''
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    manifest: {
      name: 'Healthcare Monitoring System',
      short_name: 'HealthMonitor',
      description: 'Real-time patient vital monitoring system',
      theme_color: '#0066CC',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        }
      ]
    }
  }
})