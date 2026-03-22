import { useEffect, useRef, useState } from 'react'
import type { BackgroundConfig } from '../types'

function shuffleBackgrounds(
  backgrounds: BackgroundConfig[],
  lastBackground?: BackgroundConfig,
) {
  const pool = [...backgrounds]

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]]
  }

  if (lastBackground && pool.length > 1 && pool[0] === lastBackground) {
    ;[pool[0], pool[1]] = [pool[1], pool[0]]
  }

  return pool
}

function createInitialQueue(backgrounds: BackgroundConfig[]) {
  const defaults = backgrounds.filter((background) => background.default)
  const source = defaults.length > 0 ? defaults : backgrounds
  const first = source[Math.floor(Math.random() * source.length)] ?? backgrounds[0]
  const rest = shuffleBackgrounds(
    backgrounds.filter((background) => background !== first),
    first,
  )

  return {
    first,
    rest,
  }
}

export function useBackgroundRotation(
  backgrounds: BackgroundConfig[],
  intervalMs: number,
) {
  const initial = createInitialQueue(backgrounds)
  const [activeBackground, setActiveBackground] = useState(initial.first)
  const [previousBackground, setPreviousBackground] =
    useState<BackgroundConfig | null>(null)
  const queueRef = useRef<BackgroundConfig[]>(initial.rest)
  const activeRef = useRef(activeBackground)

  useEffect(() => {
    activeRef.current = activeBackground
  }, [activeBackground])

  useEffect(() => {
    if (backgrounds.length === 0) {
      return
    }

    const advance = () => {
      if (queueRef.current.length === 0) {
        queueRef.current = shuffleBackgrounds(backgrounds, activeRef.current)
      }

      const next = queueRef.current.shift() ?? backgrounds[0]
      setPreviousBackground(activeRef.current)
      setActiveBackground(next)
      window.setTimeout(() => setPreviousBackground(null), 1100)
    }

    const interval = window.setInterval(advance, intervalMs)
    return () => window.clearInterval(interval)
  }, [backgrounds, intervalMs])

  return {
    activeBackground,
    previousBackground,
  }
}
