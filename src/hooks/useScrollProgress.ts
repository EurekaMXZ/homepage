import { useEffect, useState } from 'react'

interface ScrollProgressState {
  scrollY: number
  scrollPercent: number
  hasScrolled: boolean
}

function syncScrollState() {
  const scrollY = window.scrollY
  const scrollPercent = scrollY / Math.max(window.innerHeight, 1)

  document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`)
  document.documentElement.style.setProperty('--scroll-y-percent', `${scrollPercent}`)
  document.documentElement.classList.toggle('scrolled', scrollY > 0)

  return {
    scrollY,
    scrollPercent,
    hasScrolled: scrollY > 0,
  }
}

export function useScrollProgress() {
  const [state, setState] = useState<ScrollProgressState>(() => ({
    scrollY: 0,
    scrollPercent: 0,
    hasScrolled: false,
  }))

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setState(syncScrollState())
    }

    const schedule = () => {
      if (frame !== 0) {
        return
      }

      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return state
}
