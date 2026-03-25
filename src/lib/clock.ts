export interface ZonedDateParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export interface ClockFormatters {
  displayDate: Intl.DateTimeFormat
  parts: Intl.DateTimeFormat
  timeZoneName: Intl.DateTimeFormat
}

export interface ClockModel {
  month: string
  day: string
  displayDate: string
  hour: string
  minute: string
  second: string
  secondValue: number
  timeZoneName: string
  diffLabel: string
  offsetLabel: string
  hourAngle: number
  minuteAngle: number
}

function formatOffsetLabel(offsetMinutes: number) {
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absolute = Math.abs(offsetMinutes)
  const hour = Math.floor(absolute / 60)
  const minute = absolute % 60

  return `UTC ${sign}${hour}:${minute.toString().padStart(2, '0')}`
}

function formatDelta(valueMinutes: number) {
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

export function createClockFormatters(timeZone: string): ClockFormatters {
  return {
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
  }
}

export function createClockModel(date: Date, formatters: ClockFormatters): ClockModel {
  const zoned = getDateParts(formatters.parts, date)
  const localOffsetMinutes = -date.getTimezoneOffset()
  const remoteOffsetMinutes = getOffsetMinutes(zoned, date)
  const diffMinutes = remoteOffsetMinutes - localOffsetMinutes
  const secondProgress = zoned.second + date.getMilliseconds() / 1000
  const minuteProgress = zoned.minute + secondProgress / 60
  const hourProgress = (zoned.hour % 12) + minuteProgress / 60
  const timeZoneName =
    getTimeZoneName(formatters.timeZoneName, date) ||
    formatOffsetLabel(remoteOffsetMinutes).replace('UTC ', 'GMT')

  return {
    month: zoned.month.toString().padStart(2, '0'),
    day: zoned.day.toString().padStart(2, '0'),
    displayDate: formatters.displayDate.format(date),
    hour: zoned.hour.toString().padStart(2, '0'),
    minute: zoned.minute.toString().padStart(2, '0'),
    second: zoned.second.toString().padStart(2, '0'),
    secondValue: zoned.second,
    timeZoneName,
    diffLabel:
      diffMinutes === 0
        ? 'same time'
        : diffMinutes > 0
          ? `${formatDelta(diffMinutes)} ahead`
          : `${formatDelta(diffMinutes)} behind`,
    offsetLabel: formatOffsetLabel(remoteOffsetMinutes),
    hourAngle: hourProgress * 30,
    minuteAngle: minuteProgress * 6,
  }
}
