import { ProjectCard } from './ProjectCard'
import type { ProjectCardData } from '../types'

interface ProjectRailProps {
  projects: ProjectCardData[]
}

export function ProjectRail({ projects }: ProjectRailProps) {
  return (
    <div className="projects">
      {projects.map((project) => (
        <ProjectCard key={project.repo} project={project} />
      ))}
    </div>
  )
}
