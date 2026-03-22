import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import type { BackgroundConfig } from '../types'

const dominantColorCache = new Map<string, string>()

function setCssVariable(name: string, value: string) {
  document.body.style.setProperty(name, value)
  document.documentElement.style.setProperty(name, value)
}

function setRgbFallbackChannels(name: string, value: string) {
  const normalized = value.replace('#', '')

  if (normalized.length !== 6) {
    return
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)

  document.documentElement.style.setProperty(`${name}-rgb`, `${r}, ${g}, ${b}`)
}

export function applyMaterialTheme(sourceColor: string) {
  const theme = themeFromSourceColor(argbFromHex(sourceColor))
  const scheme = theme.schemes.light
  const values = {
    '--md-sys-color-primary': hexFromArgb(scheme.primary),
    '--md-sys-color-on-primary': hexFromArgb(scheme.onPrimary),
    '--md-sys-color-primary-container': hexFromArgb(scheme.primaryContainer),
    '--md-sys-color-on-primary-container': hexFromArgb(scheme.onPrimaryContainer),
    '--md-sys-color-secondary': hexFromArgb(scheme.secondary),
    '--md-sys-color-on-secondary': hexFromArgb(scheme.onSecondary),
    '--md-sys-color-secondary-container': hexFromArgb(scheme.secondaryContainer),
    '--md-sys-color-on-secondary-container': hexFromArgb(
      scheme.onSecondaryContainer,
    ),
    '--md-sys-color-tertiary': hexFromArgb(scheme.tertiary),
    '--md-sys-color-on-tertiary': hexFromArgb(scheme.onTertiary),
    '--md-sys-color-tertiary-container': hexFromArgb(scheme.tertiaryContainer),
    '--md-sys-color-on-tertiary-container': hexFromArgb(
      scheme.onTertiaryContainer,
    ),
    '--md-sys-color-surface-variant': hexFromArgb(scheme.surfaceVariant),
    '--md-sys-color-on-surface-variant': hexFromArgb(scheme.onSurfaceVariant),
    '--md-sys-color-outline': hexFromArgb(scheme.outline),
    '--md-sys-color-outline-variant': hexFromArgb(scheme.outlineVariant),
    '--md-sys-color-shadow': hexFromArgb(scheme.shadow),
    '--md-sys-color-inverse-primary': hexFromArgb(scheme.inversePrimary),
  }

  for (const [name, value] of Object.entries(values)) {
    setCssVariable(name, value)
    setRgbFallbackChannels(name, value)
  }
}

export async function extractDominantColor(background: BackgroundConfig) {
  if (background.dominantColor) {
    return background.dominantColor
  }

  const cached = dominantColorCache.get(background.url)
  if (cached) {
    return cached
  }

  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.decoding = 'async'

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error(`Failed to load ${background.url}`))
    image.src = background.url
  })

  const canvas = document.createElement('canvas')
  canvas.width = 48
  canvas.height = 48

  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) {
    return '#68bba1'
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data

  let red = 0
  let green = 0
  let blue = 0
  let samples = 0

  for (let index = 0; index < pixels.length; index += 16) {
    red += pixels[index] ?? 0
    green += pixels[index + 1] ?? 0
    blue += pixels[index + 2] ?? 0
    samples += 1
  }

  const color = `#${[red, green, blue]
    .map((value) => Math.round(value / samples).toString(16).padStart(2, '0'))
    .join('')}`

  dominantColorCache.set(background.url, color)
  return color
}
