import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Widget } from './Widget'
import type { ImageWidgetConfig } from '../types'

interface ImageWidgetProps {
  config: ImageWidgetConfig
}

export function ImageWidget({ config }: ImageWidgetProps) {
  const [imageState, setImageState] = useState(() => ({
    sourceSrc: config.src,
    currentSrc: config.src,
    loaded: false,
  }))
  const useImageElement =
    (config.backgroundSize === 'contain' || config.backgroundSize === 'cover') &&
    !config.mobileBackgroundSize &&
    !config.mobileBackgroundPosition &&
    !config.pixelated

  const currentSrc =
    imageState.sourceSrc === config.src ? imageState.currentSrc : config.src
  const loaded = imageState.sourceSrc === config.src ? imageState.loaded : false

  useEffect(() => {
    if (!useImageElement || !config.fallbackSrc || loaded || currentSrc !== config.src) {
      return
    }

    const timer = window.setTimeout(() => {
      setImageState((previous) => {
        if (previous.sourceSrc !== config.src || previous.currentSrc !== config.src) {
          return previous
        }

        return {
          sourceSrc: config.src,
          currentSrc: config.fallbackSrc!,
          loaded: false,
        }
      })
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
      onLoad={() => {
        setImageState({
          sourceSrc: config.src,
          currentSrc,
          loaded: true,
        })
      }}
      onError={() => {
        if (config.fallbackSrc && currentSrc !== config.fallbackSrc) {
          setImageState({
            sourceSrc: config.src,
            currentSrc: config.fallbackSrc,
            loaded: false,
          })
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
