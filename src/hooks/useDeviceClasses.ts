import { useEffect } from 'react'

function isSafariUserAgent(userAgent: string) {
  return userAgent.includes('Safari') && !userAgent.includes('Chrome')
}

export function useDeviceClasses() {
  useEffect(() => {
    document.body.classList.toggle(
      'safari',
      isSafariUserAgent(window.navigator.userAgent),
    )

    const markTouchDevice = () => {
      document.body.classList.add('touch-device')
      window.removeEventListener('touchstart', markTouchDevice)
    }

    window.addEventListener('touchstart', markTouchDevice, { passive: true })

    return () => {
      window.removeEventListener('touchstart', markTouchDevice)
    }
  }, [])
}
