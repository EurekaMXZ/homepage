import { existsSync } from 'node:fs'
import { encode } from 'blurhash'
import react from '@vitejs/plugin-react'
import sharp from 'sharp'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { backgrounds } from './src/config/backgrounds'

const backgroundManifestId = 'virtual:background-manifest'
const resolvedBackgroundManifestId = `\0${backgroundManifestId}`

interface GeneratedBackgroundData {
  blurHash: string
  dominantColor: string
  placeholderDataUrl: string
}

type BackgroundManifest = Record<string, GeneratedBackgroundData>

function isBackgroundManifestLoggingEnabled() {
  const value = process.env.BACKGROUND_MANIFEST_LOGS ?? process.env.VITE_BACKGROUND_LOGS
  return value === '1' || value === 'true'
}

function logBackgroundManifest(message: string, enabled: boolean) {
  if (enabled) {
    console.info(`[background-manifest] ${message}`)
  }
}

function toHexChannel(value: number | undefined) {
  return Math.max(0, Math.min(255, value ?? 0)).toString(16).padStart(2, '0')
}

function toHexColor(red: number | undefined, green: number | undefined, blue: number | undefined) {
  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`
}

async function fetchBackgroundBuffer(url: string) {
  let lastError: unknown

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
      }

      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      lastError = error

      if (attempt < 3) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1500 * attempt)
        })
      }
    }
  }

  throw lastError
}

async function generateBackgroundData(
  url: string,
  loggingEnabled: boolean,
): Promise<GeneratedBackgroundData> {
  const startedAt = Date.now()
  const buffer = await fetchBackgroundBuffer(url)
  const image = sharp(buffer, { failOn: 'none' }).rotate()

  const rawPlaceholder = await image
    .clone()
    .resize(32, 32, { fit: 'cover' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const dominantPixel = await image
    .clone()
    .resize(1, 1, { fit: 'cover' })
    .flatten({ background: '#000000' })
    .raw()
    .toBuffer()

  const placeholderBuffer = await image
    .clone()
    .resize(128, 128, { fit: 'cover' })
    .blur(3.5)
    .jpeg({ quality: 72 })
    .toBuffer()

  const generated = {
    blurHash: encode(
      new Uint8ClampedArray(rawPlaceholder.data),
      rawPlaceholder.info.width,
      rawPlaceholder.info.height,
      4,
      3,
    ),
    dominantColor: toHexColor(
      dominantPixel[0],
      dominantPixel[1],
      dominantPixel[2],
    ),
    placeholderDataUrl: `data:image/jpeg;base64,${placeholderBuffer.toString('base64')}`,
  }

  logBackgroundManifest(
    `${url} -> dominantColor=${generated.dominantColor}, blurHash=${generated.blurHash}, ${Date.now() - startedAt}ms`,
    loggingEnabled,
  )

  return generated
}

async function buildBackgroundManifest(failOnError: boolean) {
  const loggingEnabled = isBackgroundManifestLoggingEnabled()
  const startedAt = Date.now()
  logBackgroundManifest(`starting for ${backgrounds.length} backgrounds`, loggingEnabled)

  const entries = await Promise.all(
    backgrounds.map(async (background) => {
      try {
        return [
          background.url,
          await generateBackgroundData(background.url, loggingEnabled),
        ] as const
      } catch (error) {
        if (failOnError) {
          throw error
        }

        console.warn(
          `[background-manifest] Failed to prepare placeholder for ${background.url}:`,
          error,
        )

        return null
      }
    }),
  )

  const manifest = Object.fromEntries(
    entries.filter((entry): entry is readonly [string, GeneratedBackgroundData] => entry !== null),
  )

  logBackgroundManifest(
    `completed with ${Object.keys(manifest).length} entries in ${Date.now() - startedAt}ms`,
    loggingEnabled,
  )

  return manifest
}

function backgroundManifestPlugin(failOnError: boolean): Plugin {
  let manifestPromise: Promise<BackgroundManifest> | null = null

  const ensureManifest = () => {
    if (!manifestPromise) {
      manifestPromise = buildBackgroundManifest(failOnError)
    }

    return manifestPromise
  }

  return {
    name: 'background-manifest',
    async buildStart() {
      await ensureManifest()
    },
    resolveId(id) {
      if (id === backgroundManifestId) {
        return resolvedBackgroundManifestId
      }

      return null
    },
    async load(id) {
      if (id !== resolvedBackgroundManifestId) {
        return null
      }

      const manifest = await ensureManifest()
      return `export default ${JSON.stringify(manifest)}`
    },
    transformIndexHtml() {
      const defaults = backgrounds.filter((background) => background.default)
      const preloadTargets = defaults.length > 0 ? defaults : backgrounds.slice(0, 1)

      return preloadTargets.map((background) => ({
        tag: 'link',
        attrs: {
          rel: 'preload',
          as: 'image',
          href: background.url,
          fetchpriority: 'high',
        },
        injectTo: 'head',
      }))
    },
  }
}

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

export default defineConfig(({ command }) => ({
  base: resolveBasePath(),
  plugins: [react(), backgroundManifestPlugin(command === 'build')],
}))
