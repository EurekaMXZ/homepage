import { cloneElement, createElement, isValidElement } from 'react'
import type { ReactElement } from 'react'
import { isSimpleIcon, isWidgetIconConfig } from '../lib/icon'
import type { WidgetIcon } from '../types'

interface IconRendererProps {
  icon: WidgetIcon
  className?: string
}

function mergeClassName(currentClassName: unknown, nextClassName?: string) {
  return [currentClassName, nextClassName].filter(Boolean).join(' ')
}

export function IconRenderer({ icon, className }: IconRendererProps) {
  if (isValidElement(icon)) {
    return cloneElement(icon as ReactElement<Record<string, unknown>>, {
      'aria-hidden': true,
      className: mergeClassName(
        (icon.props as { className?: string } | null)?.className,
        className,
      ),
    })
  }

  if (isSimpleIcon(icon)) {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d={icon.path} />
      </svg>
    )
  }

  if (!isWidgetIconConfig(icon)) {
    return null
  }

  const { component, props } = icon

  return createElement(component, {
    'aria-hidden': true,
    className: mergeClassName(props?.className, className),
    ...props,
  })
}
