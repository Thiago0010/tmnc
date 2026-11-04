import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
      },
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icons/**/*'],
      manifest: {
        name: 'Ice Wall',
        short_name: 'Ice Wall',
        description: 'Seu muro contra golpes digitais. Verifique notícias e aprenda a identificar golpes.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#050A18',
        theme_color: '#050A18',
        id: '/',
        scope: '/',
        lang: 'pt-BR',
        categories: ['utilities', 'security', 'education'],
      },
    }),
  ],
})
