import type { ElementType, ReactElement } from 'react'
import type { SimpleIcon } from 'simple-icons'

export interface WidgetIconConfig {
  component: ElementType
  props?: Record<string, unknown>
}

export type WidgetIcon = ReactElement | WidgetIconConfig | SimpleIcon

export interface ProfileConfig {
  semanticName: string
  avatar: string
  bio: string
  email: string
}

export interface SiteConfig {
  metadata: {
    title: string
    description: string
  }
  profile: ProfileConfig
  theme: {
    backgroundIntervalMs: number
  }
  clock: {
    label: string
    timeZone: string
  }
  footer: {
    prefix: string
  }
  github: {
    apiBaseUrl: string
    cacheKey: string
    cacheTtlMs: number
  }
}

export interface BackgroundConfig {
  url: string
  displayName: string
  link: string
  dominantColor?: string
  blurHash?: string
  placeholderDataUrl?: string
  position?: string
  default?: boolean
}

interface BaseWidgetConfig {
  id: string
  columns: number
  rows: number
  mColumns?: number
  mRows?: number
  startColumn?: number
  startRow?: number
  mStartColumn?: number
  mStartRow?: number
  mobileAspectRatio?: string
}

export interface LinkWidgetConfig extends BaseWidgetConfig {
  type: 'link'
  title: string
  description: string
  icon: WidgetIcon
  href: string
  badgeLabel?: string
  previewSrc?: string
  iconBg?: string
  iconFg?: string
  iconSize?: string
}

export interface ImageWidgetConfig extends BaseWidgetConfig {
  type: 'image'
  src: string
  alt: string
  href?: string
  fallbackSrc?: string
  padding?: number
  backgroundColor?: string
  backgroundSize?: string
  backgroundPosition?: string
  mobileBackgroundSize?: string
  mobileBackgroundPosition?: string
  pixelated?: boolean
}

export interface ClockWidgetConfig extends BaseWidgetConfig {
  type: 'clock'
  label: string
  timeZone: string
}

export type WidgetConfig =
  | LinkWidgetConfig
  | ImageWidgetConfig
  | ClockWidgetConfig

export interface ProjectLanguageNode {
  name: string
  color?: string
}

export interface ProjectMeta {
  description?: string
  stargazerCount?: number
  forkCount?: number
}

export interface ProjectConfig {
  name: string
  repo: string
  primaryLanguage?: ProjectLanguageNode
  desc?: string
  descOverride?: boolean
  hrefOverride?: string
}

export interface ProjectCardData extends ProjectConfig {
  meta?: ProjectMeta
}
