import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === '/') {
    return '/'
  }

  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function resolveBasePath() {
  const explicitBase = process.env.VITE_BASE_PATH

  if (explicitBase) {
    return normalizeBasePath(explicitBase)
  }

  if (process.env.GITHUB_ACTIONS !== 'true') {
    return '/'
  }

  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]

  if (!repository || repository.endsWith('.github.io')) {
    return '/'
  }

  if (existsSync(new URL('./public/CNAME', import.meta.url))) {
    return '/'
  }

  return normalizeBasePath(repository)
}

export default defineConfig({
  base: resolveBasePath(),
  plugins: [react()],
})
