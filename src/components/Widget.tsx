import type { CSSProperties, ReactNode } from 'react'
import { useTiltEffect } from '../hooks/useTiltEffect'

interface WidgetProps {
  columns: number
  rows: number
  mColumns?: number
  mRows?: number
  startColumn?: number
  startRow?: number
  mStartColumn?: number
  mStartRow?: number
  mobileAspectRatio?: string
  href?: string
  className?: string
  children: ReactNode
  ariaLabel?: string
  directChild?: boolean
}

export function Widget({
  columns,
  rows,
  mColumns = columns,
  mRows = rows,
  startColumn,
  startRow,
  mStartColumn,
  mStartRow,
  mobileAspectRatio,
  href,
  className,
  children,
  ariaLabel,
  directChild = false,
}: WidgetProps) {
  const disableTilt =
    typeof document === 'undefined'
      ? true
      : document.body.classList.contains('touch-device') ||
        document.body.classList.contains('safari')

  const { ref, eventHandlers } = useTiltEffect<HTMLElement>(disableTilt)
  const widgetClasses = ['widget']

  if (mobileAspectRatio) {
    widgetClasses.push('mobile-aspect-ratio')
  }

  if (mColumns !== columns || mRows !== rows) {
    widgetClasses.push('mobile-specific-size')
  }

  if (mStartColumn !== undefined || mStartRow !== undefined) {
    widgetClasses.push('mobile-specific-placement')
  }

  if (rows === 1 && mRows === 1) {
    widgetClasses.push('one-line')
  } else if (rows === 1 && mRows !== 1) {
    widgetClasses.push('one-line', 'one-line-pc-only')
  } else if (rows !== 1 && mRows === 1) {
    widgetClasses.push('one-line', 'one-line-mobile-only')
  }

  if (className) {
    widgetClasses.push(className)
  }

  const style = {
    '--columns': columns,
    '--rows': rows,
    '--m-columns': mColumns,
    '--m-rows': mRows,
    '--col-start': startColumn === undefined ? undefined : startColumn + 1,
    '--row-start': startRow === undefined ? undefined : startRow + 1,
    '--m-col-start': mStartColumn === undefined ? undefined : mStartColumn + 1,
    '--m-row-start': mStartRow === undefined ? undefined : mStartRow + 1,
    '--mobile-aspect-ratio': mobileAspectRatio,
  } as CSSProperties

  const content = directChild
    ? children
    : href
      ? (
          <a href={href} target="_blank" rel="noreferrer" draggable={false}>
            {children}
          </a>
        )
      : (
          <div>{children}</div>
        )

  return (
    <article
      ref={ref as never}
      className={widgetClasses.join(' ')}
      style={style}
      aria-label={ariaLabel}
      {...eventHandlers}
    >
      {content}
    </article>
  )
}
