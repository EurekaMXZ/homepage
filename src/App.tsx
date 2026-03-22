import { useEffect, useMemo, useRef } from 'react'
import { BackgroundManager } from './components/BackgroundManager'
import { FooterBar } from './components/FooterBar'
import { HeroSection } from './components/HeroSection'
import { MainContent } from './components/MainContent'
import { ScrollArrow } from './components/ScrollArrow'
import { backgrounds } from './config/backgrounds'
import { bentoWidgets } from './config/widgets'
import { projects } from './config/projects'
import { siteConfig } from './config/site'
import { useBackgroundRotation } from './hooks/useBackgroundRotation'
import { useDeviceClasses } from './hooks/useDeviceClasses'
import { useDynamicTheme } from './hooks/useDynamicTheme'
import { useGitHubProjects } from './hooks/useGitHubProjects'
import { useScrollProgress } from './hooks/useScrollProgress'

function easeOutExpo(value: number) {
  return value === 1 ? 1 : 1 - 2 ** (-10 * value)
}

export default function App() {
  const mainRef = useRef<HTMLElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useDeviceClasses()

  const { hasScrolled } = useScrollProgress()
  const { activeBackground, previousBackground } = useBackgroundRotation(
    backgrounds,
    siteConfig.theme.backgroundIntervalMs,
  )
  const projectCards = useGitHubProjects(projects)

  useDynamicTheme(activeBackground)

  useEffect(() => {
    document.title = siteConfig.metadata.title
    const description = document.querySelector('meta[name="description"]')

    if (description) {
      description.setAttribute('content', siteConfig.metadata.description)
    }
  }, [])

  const scrollToContent = () => {
    const startY = window.scrollY
    const targetY = 0.25 * window.innerHeight - 10
    const startTime = performance.now()

    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / 800, 1)
      const nextY = startY + (targetY - startY) * easeOutExpo(progress)
      window.scrollTo(0, nextY)

      if (progress < 1) {
        animationRef.current = window.requestAnimationFrame(step)
      } else {
        animationRef.current = null
      }
    }

    animationRef.current = window.requestAnimationFrame(step)
  }

  useEffect(() => {
    const cancelAnimation = () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }

    window.addEventListener('wheel', cancelAnimation, { passive: true })

    return () => {
      window.removeEventListener('wheel', cancelAnimation)
    }
  }, [])

  const footerLabel = useMemo(() => siteConfig.footer.prefix, [])

  return (
    <>
      <BackgroundManager
        activeBackground={activeBackground}
        previousBackground={previousBackground}
      />
      <HeroSection profile={siteConfig.profile} />
      <ScrollArrow hidden={hasScrolled} onClick={scrollToContent} />
      <MainContent ref={mainRef} widgets={bentoWidgets} projects={projectCards} />
      <FooterBar
        label={footerLabel}
        link={activeBackground.link}
        sourceLabel={activeBackground.displayName}
      />
    </>
  )
}
