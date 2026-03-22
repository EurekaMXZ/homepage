import { Widget } from './Widget'
import { useZonedClock } from '../hooks/useZonedClock'
import type { ClockWidgetConfig } from '../types'

interface ClockWidgetProps {
  config: ClockWidgetConfig
}

export function ClockWidget({ config }: ClockWidgetProps) {
  const clock = useZonedClock(config.timeZone)

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
      ariaLabel={`${config.label} ${clock.hour}:${clock.minute}`}
      directChild
    >
      <div className="clock-widget">
        <div className="widget-clock-face">
          <svg
            className="widget-clock-bg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            aria-hidden="true"
          >
            <path d="M469.881,324.15a90.631,90.631,0,0,1,7.616-28.425l15.88-32.267c3.642-7.4,3.642-19.514,0-26.916L477.5,204.275a90.631,90.631,0,0,1-7.616-28.425L467.5,139.967c-.547-8.232-6.6-18.722-13.459-23.311l-29.885-20a90.643,90.643,0,0,1-20.809-20.809l-20-29.885C378.755,39.1,368.265,33.047,360.033,32.5L324.15,30.119A90.631,90.631,0,0,1,295.725,22.5L263.458,6.623c-7.4-3.642-19.514-3.642-26.916,0L204.275,22.5a90.631,90.631,0,0,1-28.425,7.616L139.967,32.5c-8.232.547-18.722,6.6-23.311,13.459l-20,29.885A90.643,90.643,0,0,1,75.844,96.653l-29.885,20C39.1,121.245,33.047,131.735,32.5,139.967L30.119,175.85A90.631,90.631,0,0,1,22.5,204.275L6.623,236.542c-3.642,7.4-3.642,19.514,0,26.916L22.5,295.725a90.631,90.631,0,0,1,7.616,28.425L32.5,360.033c.546,8.232,6.6,18.722,13.458,23.311l29.885,20a90.643,90.643,0,0,1,20.809,20.809l20,29.885c4.589,6.856,15.079,12.912,23.311,13.459l35.883,2.381a90.631,90.631,0,0,1,28.425,7.616l32.267,15.88c7.4,3.642,19.514,3.642,26.916,0l32.267-15.88a90.631,90.631,0,0,1,28.425-7.616l35.883-2.381c8.232-.547,18.722-6.6,23.311-13.459l20-29.885a90.643,90.643,0,0,1,20.809-20.809l29.885-20c6.856-4.589,12.912-15.079,13.458-23.311Z" />
          </svg>
          <div
            className="widget-clock-hand widget-clock-hour-hand"
            style={{ transform: `rotate(${clock.hourAngle}deg)` }}
          />
          <div
            className="widget-clock-hand widget-clock-minute-hand"
            style={{ transform: `rotate(${clock.minuteAngle}deg)` }}
          />
          <div
            className="widget-clock-hand widget-clock-second-hand"
            style={{ transform: `rotate(${clock.secondAngle}deg)` }}
          />
        </div>
        <div className="widget-clock-text">
          <div className="widget-clock-date">
            <span className="widget-clock-date-text">{clock.displayDate}</span>{' '}
            <span className="widget-clock-timezone-abbr">{clock.timeZoneName}</span>
          </div>
          <div className="widget-clock-time">
            <span className="widget-clock-hour">{clock.hour}</span>
            <span className="literal">:</span>
            <span className="widget-clock-minute">{clock.minute}</span>
            <span className="literal">:</span>
            <span className="widget-clock-second">{clock.second}</span>
          </div>
          <div className="widget-clock-timezone">
            <span className="widget-clock-timezone-diff">{clock.diffLabel}</span>
            <span className="widget-clock-timezone-utc-offset">
              {' '}
              / {clock.offsetLabel}
            </span>
          </div>
        </div>
      </div>
    </Widget>
  )
}
