import { useEffect } from 'react'
import { applyMaterialTheme } from '../lib/color'
import type { BackgroundConfig } from '../types'

export function useDynamicTheme(background: BackgroundConfig) {
  useEffect(() => {
    if (!background.dominantColor) {
      return
    }

    applyMaterialTheme(background.dominantColor)
  }, [background])
}
