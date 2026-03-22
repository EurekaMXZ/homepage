import type { CSSProperties } from 'react'
import { getSimpleIconColor, IconRenderer } from './IconRenderer'
import { Widget } from './Widget'
import type { LinkWidgetConfig } from '../types'

interface LinkWidgetProps {
  config: LinkWidgetConfig
}

export function LinkWidget({ config }: LinkWidgetProps) {
  const brandColor = getSimpleIconColor(config.icon)

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
      href={config.href}
      ariaLabel={`${config.title} ${config.description}`}
    >
      <div className="weblink-widget">
        <div className="widget-content">
          <div
            className="widget-icon"
            style={
              {
                '--bg': config.iconBg ?? (brandColor ? `color-mix(in srgb, ${brandColor}, white 84%)` : undefined),
                '--fg': config.iconFg ?? brandColor,
                '--size': config.iconSize,
              } as CSSProperties
            }
          >
            <IconRenderer icon={config.icon} />
          </div>
          <div className="widget-meta">
            <div className="widget-name">{config.title}</div>
            <div className="widget-description">{config.description}</div>
          </div>
          {config.badgeLabel ? (
            <div className="widget-button">{config.badgeLabel}</div>
          ) : null}
        </div>
        {config.previewSrc ? (
          <div className="widget-image">
            <div
              className="widget-image-bg"
              style={{
                backgroundImage: `url(${config.previewSrc})`,
              }}
            />
          </div>
        ) : null}
      </div>
    </Widget>
  )
}
