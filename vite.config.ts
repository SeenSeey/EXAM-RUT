import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icons/icon.svg'],
    manifest: {
      name: 'Магистр — подготовка к экзаменам', short_name: 'Магистр', lang: 'ru',
      description: 'Карточки для подготовки к вступительным экзаменам',
      theme_color: '#101c35', background_color: '#f5f6f8', display: 'standalone', start_url: './',
      icons: [{ src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
    },
    workbox: { navigateFallback: 'index.html', globPatterns: ['**/*.{js,css,html,svg,json}'], cleanupOutdatedCaches: true, maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 }
  })],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', css: true }
});
