import { useEffect } from 'react'
import { siteConfig } from '../config/site'
import { applyMaterialTheme, extractDominantColor } from '../lib/color'
import type { BackgroundConfig } from '../types'

export function useDynamicTheme(background: BackgroundConfig) {
  useEffect(() => {
    let cancelled = false

    extractDominantColor(background)
      .then((color) => {
        if (!cancelled) {
          applyMaterialTheme(color)
        }
      })
      .catch(() => {
        if (!cancelled) {
          applyMaterialTheme(siteConfig.theme.defaultDominantColor)
        }
      })

    return () => {
      cancelled = true
    }
  }, [background])
}
