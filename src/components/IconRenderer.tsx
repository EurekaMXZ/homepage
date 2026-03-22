import { cloneElement, createElement, isValidElement } from 'react'
import type { ReactElement } from 'react'
import type { SimpleIcon } from 'simple-icons'
import type { WidgetIcon, WidgetIconConfig } from '../types'

interface IconRendererProps {
  icon: WidgetIcon
  className?: string
}

function mergeClassName(currentClassName: unknown, nextClassName?: string) {
  return [currentClassName, nextClassName].filter(Boolean).join(' ')
}

function isWidgetIconConfig(icon: WidgetIcon): icon is WidgetIconConfig {
  return typeof icon === 'object' && 'component' in icon
}

function isSimpleIcon(icon: WidgetIcon): icon is SimpleIcon {
  return (
    typeof icon === 'object' &&
    icon !== null &&
    'path' in icon &&
    'hex' in icon &&
    'title' in icon
  )
}

export function getSimpleIconColor(icon: WidgetIcon) {
  if (!isSimpleIcon(icon)) {
    return undefined
  }

  return `#${icon.hex}`
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
