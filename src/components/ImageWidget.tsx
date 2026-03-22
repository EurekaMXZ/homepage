import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Widget } from './Widget'
import type { ImageWidgetConfig } from '../types'

interface ImageWidgetProps {
  config: ImageWidgetConfig
}

export function ImageWidget({ config }: ImageWidgetProps) {
  const [currentSrc, setCurrentSrc] = useState(config.src)
  const [loaded, setLoaded] = useState(false)
  const useImageElement =
    (config.backgroundSize === 'contain' || config.backgroundSize === 'cover') &&
    !config.mobileBackgroundSize &&
    !config.mobileBackgroundPosition &&
    !config.pixelated

  useEffect(() => {
    setCurrentSrc(config.src)
    setLoaded(false)
  }, [config.src])

  useEffect(() => {
    if (!useImageElement || !config.fallbackSrc || loaded || currentSrc !== config.src) {
      return
    }

    const timer = window.setTimeout(() => {
      setCurrentSrc(config.fallbackSrc!)
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [config.fallbackSrc, config.src, currentSrc, loaded, useImageElement])

  const imageWidgetStyle = {
    '--padding': config.padding ? `${config.padding}px` : undefined,
    '--bg-color': config.backgroundColor,
    '--bg-size': config.backgroundSize,
    '--bg-pos': config.backgroundPosition,
    '--bg-m-size': config.mobileBackgroundSize,
    '--bg-m-pos': config.mobileBackgroundPosition,
  } as CSSProperties

  const imageContent = useImageElement ? (
    <img
      className="widget-pure-img-element"
      src={currentSrc}
      alt={config.alt}
      loading="lazy"
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (config.fallbackSrc && currentSrc !== config.fallbackSrc) {
          setCurrentSrc(config.fallbackSrc)
        }
      }}
      style={{
        objectFit: config.backgroundSize as CSSProperties['objectFit'],
        objectPosition: config.backgroundPosition ?? 'center',
      }}
    />
  ) : (
    <div
      className="widget-pure-img"
      style={{
        backgroundImage: `url(${currentSrc})`,
      }}
    />
  )

  return (
    <Widget
      columns={config.columns}
      rows={config.rows}
      mColumns={config.mColumns}
      mRows={config.mRows}
      startColumn={config.startColumn}
      startRow={config.startRow}
      mStartColumn={config.mStartColumn}
      mStartRow={config.mStartRow}
      mobileAspectRatio={config.mobileAspectRatio}
      ariaLabel={config.alt}
      directChild
    >
      {config.href ? (
        <a
          className={`image-widget ${config.pixelated ? 'pixelated' : ''}`}
          href={config.href}
          target="_blank"
          rel="noreferrer"
          draggable={false}
          style={imageWidgetStyle}
        >
          {imageContent}
        </a>
      ) : (
        <div
          className={`image-widget ${config.pixelated ? 'pixelated' : ''}`}
          style={imageWidgetStyle}
        >
          {imageContent}
        </div>
      )}
    </Widget>
  )
}
