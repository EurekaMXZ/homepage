import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities'
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
