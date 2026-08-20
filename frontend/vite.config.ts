import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/controle_rural/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    // O chunk de entrada inclui o SDK do Supabase (auth + realtime + postgrest),
    // necessário já na tela de login; as rotas internas já são carregadas sob
    // demanda (ver App.tsx). ~172kb gzip de entrada é o piso real dessa stack.
    chunkSizeWarningLimit: 650,
  },
})
