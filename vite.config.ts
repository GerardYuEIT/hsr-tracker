import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const ICONS_DIR = path.resolve(__dirname, '../icons')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-icons',
      configureServer(server) {
        server.middlewares.use('/icons', (req, res, next) => {
          try {
            const file = path.join(ICONS_DIR, decodeURIComponent(req.url ?? '').replace(/^\//, ''))
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
              const ext = path.extname(file).toLowerCase()
              const mime: Record<string, string> = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }
              res.setHeader('Content-Type', mime[ext] ?? 'application/octet-stream')
              res.setHeader('Cache-Control', 'public, max-age=86400')
              fs.createReadStream(file).pipe(res)
            } else {
              next()
            }
          } catch {
            next()
          }
        })
      },
    },
  ],
})
