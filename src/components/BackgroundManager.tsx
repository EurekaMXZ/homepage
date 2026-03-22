import { useEffect } from 'react'
import type { BackgroundConfig } from '../types'

interface BackgroundManagerProps {
  activeBackground: BackgroundConfig
  activeBackgroundLoaded: boolean
  previousBackground: BackgroundConfig | null
}

function BackgroundLayer({
  background,
  dismissing = false,
  fullImageLoaded,
}: {
  background: BackgroundConfig
  dismissing?: boolean
  fullImageLoaded: boolean
}) {
  return (
    <div className={`background-layer${dismissing ? ' dismissing' : ''}`}>
      <div
        className="background-image background-placeholder"
        style={{
          backgroundColor: background.dominantColor,
          backgroundImage: background.placeholderDataUrl
            ? `url(${background.placeholderDataUrl})`
            : undefined,
          backgroundPosition: background.position ?? 'center',
        }}
      />
      <div
        className={`background-image background-full${fullImageLoaded ? ' is-loaded' : ''}`}
        style={{
          backgroundImage: `url(${background.url})`,
          backgroundPosition: background.position ?? 'center',
        }}
      />
      <div className="background-image background-mask" />
    </div>
  )
}

export function BackgroundManager({
  activeBackground,
  activeBackgroundLoaded,
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
        <BackgroundLayer
          background={previousBackground}
          dismissing
          fullImageLoaded
        />
      ) : null}
      <BackgroundLayer
        key={activeBackground.url}
        background={activeBackground}
        fullImageLoaded={activeBackgroundLoaded}
      />
    </div>
  )
}
