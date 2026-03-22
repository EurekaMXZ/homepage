import { GitFork, Star } from 'lucide-react'
import { formatCompactNumber } from '../lib/github'
import { getGitHubLanguageColor } from '../data/githubLanguageColors'
import { useTiltEffect } from '../hooks/useTiltEffect'
import type { ProjectCardData } from '../types'

interface ProjectCardProps {
  project: ProjectCardData
}

function MetaStarIcon() {
  return <Star aria-hidden="true" fill="currentColor" strokeWidth={1.75} />
}

function MetaForkIcon() {
  return <GitFork aria-hidden="true" strokeWidth={1.9} />
}

export function ProjectCard({ project }: ProjectCardProps) {
  const disableTilt =
    typeof document === 'undefined'
      ? true
      : document.body.classList.contains('touch-device') ||
        document.body.classList.contains('safari')

  const { ref, eventHandlers } = useTiltEffect<HTMLDivElement>(disableTilt)
  const description = project.descOverride ? project.desc : project.meta?.description
  const language = project.primaryLanguage
  const languageColor = language?.color ?? (language ? getGitHubLanguageColor(language.name) : undefined)
  const href = project.hrefOverride ?? `https://github.com/${project.repo}`

  return (
    <div className="project" ref={ref} {...eventHandlers}>
      <a href={href} target="_blank" rel="noreferrer" draggable={false}>
        <div className="project-title">{project.name}</div>
        <div className="project-description">{description}</div>
        <div className="project-metas">
          <div className="project-meta project-stars">
            <MetaStarIcon />
            {project.meta?.stargazerCount === undefined
              ? '-'
              : formatCompactNumber(project.meta.stargazerCount)}
          </div>
          <div className="project-meta project-forks">
            <MetaForkIcon />
            {project.meta?.forkCount === undefined
              ? '-'
              : formatCompactNumber(project.meta.forkCount)}
          </div>
          {language ? (
            <div className="project-meta project-language">
              <div
                className="project-language-color"
                style={{ backgroundColor: languageColor ?? '#9aa6c7' }}
              />
              {language.name}
            </div>
          ) : null}
        </div>
      </a>
    </div>
  )
}
