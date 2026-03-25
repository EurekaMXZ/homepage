import { useEffect, useMemo, useState } from 'react'
import { createClockFormatters, createClockModel } from '../lib/clock'
import { useSecondHand } from './useSecondHand'

const CLOCK_TICK_MS = 100

export function useZonedClock(timeZone: string) {
  const [initialNow] = useState(() => new Date())
  const [now, setNow] = useState(initialNow)
  const formatters = useMemo(() => createClockFormatters(timeZone), [timeZone])

  useEffect(() => {
    let timer = 0

    const scheduleTick = () => {
      const remainder = Date.now() % CLOCK_TICK_MS
      const delay = remainder === 0 ? CLOCK_TICK_MS : CLOCK_TICK_MS - remainder
      timer = window.setTimeout(() => {
        setNow(new Date())
        scheduleTick()
      }, delay)
    }

    scheduleTick()

    return () => window.clearTimeout(timer)
  }, [])

  const clockModel = useMemo(() => createClockModel(now, formatters), [formatters, now])
  const secondHand = useSecondHand(
    initialNow.getSeconds(),
    initialNow.getTime(),
    clockModel.secondValue,
    now.getTime(),
  )

  return useMemo(
    () => ({
      ...clockModel,
      secondAngle: secondHand.angle,
      secondTransitionEnabled: secondHand.transitionEnabled,
    }),
    [clockModel, secondHand.angle, secondHand.transitionEnabled],
  )
}
