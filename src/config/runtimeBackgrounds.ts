import type { BackgroundConfig } from '../types'
import manifest from 'virtual:background-manifest'
import { backgrounds } from './backgrounds'

export const runtimeBackgrounds = (backgrounds as BackgroundConfig[]).map((background) => {
  const generated = manifest[background.url]

  return {
    ...background,
    blurHash: background.blurHash ?? generated?.blurHash,
    placeholderDataUrl:
      background.placeholderDataUrl ?? generated?.placeholderDataUrl,
    dominantColor: background.dominantColor ?? generated?.dominantColor,
  }
})
