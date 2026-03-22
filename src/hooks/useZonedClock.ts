import { useEffect, useMemo, useState } from 'react'

interface ZonedDateParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function formatOffsetLabel(offsetMinutes: number) {
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absolute = Math.abs(offsetMinutes)
  const hour = Math.floor(absolute / 60)
  const minute = absolute % 60

  return `UTC ${sign}${hour}:${minute.toString().padStart(2, '0')}`
}

function formatDelta(valueMinutes: number): string {
  const absolute = Math.abs(valueMinutes)
  const minute = absolute % 60
  const hour = Math.floor(absolute / 60)
  return minute ? `${hour}h ${minute}m` : `${hour}h`
}

function getDateParts(formatter: Intl.DateTimeFormat, date: Date): ZonedDateParts {
  const parts = formatter.formatToParts(date)

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value ?? '0'),
    month: Number(parts.find((part) => part.type === 'month')?.value ?? '0'),
    day: Number(parts.find((part) => part.type === 'day')?.value ?? '0'),
    hour: Number(parts.find((part) => part.type === 'hour')?.value ?? '0'),
    minute: Number(parts.find((part) => part.type === 'minute')?.value ?? '0'),
    second: Number(parts.find((part) => part.type === 'second')?.value ?? '0'),
  }
}

function getTimeZoneName(formatter: Intl.DateTimeFormat, date: Date) {
  return (
    formatter.formatToParts(date).find((part) => part.type === 'timeZoneName')?.value ?? ''
  )
}

function getOffsetMinutes(parts: ZonedDateParts, date: Date) {
  const zonedTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )

  return Math.round((zonedTimestamp - date.getTime()) / 60000)
}

export function useZonedClock(timeZone: string) {
  const [now, setNow] = useState(() => new Date())
  const formatters = useMemo(
    () => ({
      displayDate: new Intl.DateTimeFormat(undefined, {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      parts: new Intl.DateTimeFormat('en-GB', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }),
      timeZoneName: new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'short',
      }),
    }),
    [timeZone],
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 500)

    return () => window.clearInterval(timer)
  }, [])

  return useMemo(() => {
    const zoned = getDateParts(formatters.parts, now)
    const localOffsetMinutes = -now.getTimezoneOffset()
    const remoteOffsetMinutes = getOffsetMinutes(zoned, now)
    const diffMinutes = remoteOffsetMinutes - localOffsetMinutes
    const timeZoneName =
      getTimeZoneName(formatters.timeZoneName, now) ||
      formatOffsetLabel(remoteOffsetMinutes).replace('UTC ', 'GMT')
    const minuteTurns = Math.floor(now.getTime() / 60000)

    return {
      month: zoned.month.toString().padStart(2, '0'),
      day: zoned.day.toString().padStart(2, '0'),
      displayDate: formatters.displayDate.format(now),
      hour: zoned.hour.toString().padStart(2, '0'),
      minute: zoned.minute.toString().padStart(2, '0'),
      second: zoned.second.toString().padStart(2, '0'),
      timeZoneName,
      diffLabel:
        diffMinutes === 0
          ? 'same time'
          : diffMinutes > 0
            ? `${formatDelta(diffMinutes)} ahead`
            : `${formatDelta(diffMinutes)} behind`,
      offsetLabel: formatOffsetLabel(remoteOffsetMinutes),
      hourAngle: (zoned.hour % 12) * 30 + zoned.minute * 0.5,
      minuteAngle: zoned.minute * 6 + zoned.second * 0.1,
      secondAngle: minuteTurns * 360 + zoned.second * 6,
    }
  }, [formatters, now])
}
