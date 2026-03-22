import { useEffect } from 'react'
import type { BackgroundConfig } from '../types'

interface BackgroundManagerProps {
  activeBackground: BackgroundConfig
  previousBackground: BackgroundConfig | null
}

export function BackgroundManager({
  activeBackground,
  previousBackground,
}: BackgroundManagerProps) {
  useEffect(() => {
    const moveBackground = (event: MouseEvent) => {
      if (document.body.classList.contains('touch-device')) {
        return
      }

      const dx = ((event.clientX - window.innerWidth / 2) / window.innerWidth) * 20
      const dy = ((event.clientY - window.innerHeight / 2) / window.innerHeight) * 20

      document.documentElement.style.setProperty('--tx', `${dx}px`)
      document.documentElement.style.setProperty('--ty', `${dy}px`)
    }

    const resetBackground = () => {
      document.documentElement.style.setProperty('--tx', '0px')
      document.documentElement.style.setProperty('--ty', '0px')
    }

    document.addEventListener('mousemove', moveBackground)
    document.addEventListener('mouseleave', resetBackground)

    return () => {
      document.removeEventListener('mousemove', moveBackground)
      document.removeEventListener('mouseleave', resetBackground)
    }
  }, [])

  return (
    <div id="background" aria-hidden="true">
      {previousBackground ? (
        <div
          className="background-image dismissing"
          style={{
            backgroundImage: `url(${previousBackground.url})`,
            backgroundPosition: previousBackground.position ?? 'center',
          }}
        />
      ) : null}
      <div
        key={activeBackground.url}
        className="background-image"
        style={{
          backgroundImage: `url(${activeBackground.url})`,
          backgroundPosition: activeBackground.position ?? 'center',
        }}
      />
    </div>
  )
}
