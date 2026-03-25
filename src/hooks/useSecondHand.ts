import { useEffect, useRef, useState } from 'react'

const SECOND_HAND_ANGLE_STEP = 6
const SECOND_HAND_WRAP_ANGLE = 360
const SECOND_HAND_STEP_MS = 1000
const SECOND_HAND_STEP_TOLERANCE_MS = 400

export const SECOND_HAND_TRANSITION_MS = 180

function angleFromSecond(second: number) {
  return second * SECOND_HAND_ANGLE_STEP
}

function isExpectedSingleStep(second: number, previousSecond: number, elapsedMs: number) {
  return (
    second === (previousSecond + 1) % 60 &&
    elapsedMs > 0 &&
    Math.abs(elapsedMs - SECOND_HAND_STEP_MS) <= SECOND_HAND_STEP_TOLERANCE_MS
  )
}

export function useSecondHand(initialSecond: number, initialTimeMs: number, second: number, timeMs: number) {
  const [angle, setAngle] = useState(() => angleFromSecond(initialSecond))
  const [transitionEnabled, setTransitionEnabled] = useState(false)
  const previousSecondRef = useRef(initialSecond)
  const previousTimeRef = useRef(initialTimeMs)
  const applyFrameRef = useRef<number | null>(null)
  const resetTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (applyFrameRef.current !== null) {
        window.cancelAnimationFrame(applyFrameRef.current)
      }

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const previousSecond = previousSecondRef.current
    const previousTimeMs = previousTimeRef.current

    if (second === previousSecond) {
      return
    }

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }

    if (applyFrameRef.current !== null) {
      window.cancelAnimationFrame(applyFrameRef.current)
      applyFrameRef.current = null
    }

    const elapsedMs = timeMs - previousTimeMs
    const isWrapAround = previousSecond === 59 && second === 0
    const shouldAnimate = isExpectedSingleStep(second, previousSecond, elapsedMs)

    previousSecondRef.current = second
    previousTimeRef.current = timeMs

    applyFrameRef.current = window.requestAnimationFrame(() => {
      applyFrameRef.current = null

      if (!shouldAnimate) {
        setTransitionEnabled(false)
        setAngle(angleFromSecond(second))
        return
      }

      setTransitionEnabled(true)

      if (isWrapAround) {
        setAngle(SECOND_HAND_WRAP_ANGLE)
        resetTimerRef.current = window.setTimeout(() => {
          setTransitionEnabled(false)
          setAngle(0)
          resetTimerRef.current = null
        }, SECOND_HAND_TRANSITION_MS)
        return
      }

      setAngle(angleFromSecond(second))
    })
  }, [second, timeMs])

  return {
    angle,
    transitionEnabled,
  }
}
