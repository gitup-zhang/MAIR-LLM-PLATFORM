import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 解决跨域问题
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/system': {
        target: 'http://8.155.19.142:30027/olexp_server',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/system/, '')
      }
    }
  }
})
