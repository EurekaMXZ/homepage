import { useEffect, useState } from 'react'
import { resolveProjectCards } from '../lib/github'
import type { ProjectCardData, ProjectConfig } from '../types'

export function useGitHubProjects(projects: ProjectConfig[]) {
  const [cards, setCards] = useState<ProjectCardData[]>(projects)

  useEffect(() => {
    let cancelled = false

    resolveProjectCards(projects)
      .then((resolved) => {
        if (!cancelled) {
          setCards(resolved)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCards(projects)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projects])

  return cards
}
