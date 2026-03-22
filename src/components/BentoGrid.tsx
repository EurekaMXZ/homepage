import { useEffect, useRef } from 'react'
import { ClockWidget } from './ClockWidget'
import { ImageWidget } from './ImageWidget'
import { LinkWidget } from './LinkWidget'
import type { WidgetConfig } from '../types'

interface BentoGridProps {
  widgets: WidgetConfig[]
}

function readGap(element: HTMLElement) {
  const styles = window.getComputedStyle(element)
  return Number.parseFloat(styles.columnGap || styles.gap) || 40
}

function renderWidget(widget: WidgetConfig) {
  if (widget.type === 'clock') {
    return <ClockWidget key={widget.id} config={widget} />
  }

  if (widget.type === 'image') {
    return <ImageWidget key={widget.id} config={widget} />
  }

  return <LinkWidget key={widget.id} config={widget} />
}

function validateWidgets(widgets: WidgetConfig[]) {
  for (const widget of widgets) {
    if (widget.columns <= 0 || widget.rows <= 0) {
      console.warn(`[bento] Widget "${widget.id}" has invalid desktop size.`)
    }

    if ((widget.mColumns ?? widget.columns) <= 0 || (widget.mRows ?? widget.rows) <= 0) {
      console.warn(`[bento] Widget "${widget.id}" has invalid mobile size.`)
    }
  }
}

export function BentoGrid({ widgets }: BentoGridProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      validateWidgets(widgets)
    }
  }, [widgets])

  useEffect(() => {
    const element = ref.current
    let frame = 0

    if (!element) {
      return
    }

    const sync = () => {
      const columns = window.innerWidth <= 880 ? 4 : 8
      const gap = readGap(element)
      const squareSize = (element.clientWidth - gap * (columns - 1)) / columns

      element.style.setProperty('--square-size', `${squareSize}px`)
      element.style.setProperty('--gap', `${gap}px`)
    }

    const scheduleSync = () => {
      if (frame !== 0) {
        return
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    const observer = new ResizeObserver(scheduleSync)
    observer.observe(element)
    window.addEventListener('resize', scheduleSync)
    scheduleSync()

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }
      observer.disconnect()
      window.removeEventListener('resize', scheduleSync)
    }
  }, [])

  return <div className="bento" ref={ref}>{widgets.map(renderWidget)}</div>
}
