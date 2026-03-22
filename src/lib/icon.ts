import type { SimpleIcon } from 'simple-icons'
import type { WidgetIcon, WidgetIconConfig } from '../types'

export function isWidgetIconConfig(icon: WidgetIcon): icon is WidgetIconConfig {
  return typeof icon === 'object' && icon !== null && 'component' in icon
}

export function isSimpleIcon(icon: WidgetIcon): icon is SimpleIcon {
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
