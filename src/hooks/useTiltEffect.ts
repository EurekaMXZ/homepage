import { useEffect, useRef } from 'react'

function resetTilt(element: HTMLElement) {
  element.style.setProperty('--dx', '0deg')
  element.style.setProperty('--dy', '0deg')
}

export function useTiltEffect<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current

    if (!element || disabled) {
      return
    }

    const updateTilt = (event: MouseEvent | TouchEvent) => {
      const bounds = element.getBoundingClientRect()
      const width = element.offsetWidth || bounds.width
      const height = element.offsetHeight || bounds.height

      const pageX =
        'touches' in event
          ? (event.touches[0]?.pageX ?? 0)
          : event.pageX
      const pageY =
        'touches' in event
          ? (event.touches[0]?.pageY ?? 0)
          : event.pageY

      const offsetX = pageX - bounds.left - window.scrollX
      const rotateX = 10 * (0.5 - (pageY - bounds.top - window.scrollY) / height)
      const rotateY = 10 * -(0.5 - offsetX / width)

      element.style.setProperty('--dx', `${rotateX.toFixed(3)}deg`)
      element.style.setProperty('--dy', `${rotateY.toFixed(3)}deg`)
    }

    const clearTilt = () => {
      resetTilt(element)
    }

    element.addEventListener('mousedown', updateTilt)
    element.addEventListener('mousemove', updateTilt)
    element.addEventListener('mouseleave', clearTilt)
    element.addEventListener('touchstart', updateTilt, { passive: true })
    element.addEventListener('touchmove', updateTilt, { passive: true })
    element.addEventListener('touchend', clearTilt)

    return () => {
      element.removeEventListener('mousedown', updateTilt)
      element.removeEventListener('mousemove', updateTilt)
      element.removeEventListener('mouseleave', clearTilt)
      element.removeEventListener('touchstart', updateTilt)
      element.removeEventListener('touchmove', updateTilt)
      element.removeEventListener('touchend', clearTilt)
    }
  }, [disabled])

  return { ref, eventHandlers: {} }
}
