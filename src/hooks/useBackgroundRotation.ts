import { useEffect, useRef, useState } from 'react'
import { preloadBackgroundImage, isBackgroundImageReady } from '../lib/backgroundPreload'
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
  const [activeBackgroundLoaded, setActiveBackgroundLoaded] = useState(() =>
    isBackgroundImageReady(initial.first.url),
  )
  const queueRef = useRef<BackgroundConfig[]>(initial.rest)
  const activeRef = useRef(activeBackground)

  useEffect(() => {
    activeRef.current = activeBackground
  }, [activeBackground])

  useEffect(() => {
    if (backgrounds.length === 0) {
      return
    }

    if (backgrounds.length === 1) {
      setActiveBackgroundLoaded(isBackgroundImageReady(activeRef.current.url))

      void preloadBackgroundImage(activeRef.current.url)
        .then(() => {
          setActiveBackgroundLoaded(true)
        })
        .catch((error) => {
          console.warn(error)
        })

      return
    }

    let cancelled = false
    let rotationTimer = 0
    let dismissalTimer = 0
    let activeSince = Date.now()

    const clearTimers = () => {
      if (rotationTimer !== 0) {
        window.clearTimeout(rotationTimer)
      }

      if (dismissalTimer !== 0) {
        window.clearTimeout(dismissalTimer)
      }
    }

    const markActiveLoaded = (url: string) => {
      setActiveBackgroundLoaded(isBackgroundImageReady(url))

      void preloadBackgroundImage(url)
        .then(() => {
          if (!cancelled && activeRef.current.url === url) {
            setActiveBackgroundLoaded(true)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }

    const takeNextReadyBackground = async () => {
      let attempts = 0

      while (attempts < backgrounds.length) {
        if (queueRef.current.length === 0) {
          queueRef.current = shuffleBackgrounds(backgrounds, activeRef.current)
        }

        const candidate = queueRef.current.shift() ?? backgrounds[0]
        attempts += 1

        try {
          await preloadBackgroundImage(candidate.url)
          return candidate
        } catch (error) {
          console.warn(error)
        }
      }

      return null
    }

    const scheduleAdvance = async () => {
      const next = await takeNextReadyBackground()

      if (cancelled || !next) {
        return
      }

      const delay = Math.max(activeSince + intervalMs - Date.now(), 0)

      rotationTimer = window.setTimeout(() => {
        if (cancelled) {
          return
        }

        const current = activeRef.current
        activeSince = Date.now()
        activeRef.current = next
        setPreviousBackground(current)
        setActiveBackground(next)
        setActiveBackgroundLoaded(true)

        dismissalTimer = window.setTimeout(() => {
          if (!cancelled) {
            setPreviousBackground(null)
          }
        }, 1100)

        void scheduleAdvance()
      }, delay)
    }

    markActiveLoaded(activeRef.current.url)
    void scheduleAdvance()

    return () => {
      cancelled = true
      clearTimers()
    }
  }, [backgrounds, intervalMs])

  return {
    activeBackground,
    activeBackgroundLoaded,
    previousBackground,
  }
}
