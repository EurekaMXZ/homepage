import { forwardRef } from 'react'
import { BentoGrid } from './BentoGrid'
import { ProjectRail } from './ProjectRail'
import type { ProjectCardData, WidgetConfig } from '../types'

interface MainContentProps {
  widgets: WidgetConfig[]
  projects: ProjectCardData[]
}

export const MainContent = forwardRef<HTMLElement, MainContentProps>(
  function MainContent({ widgets, projects }, ref) {
    return (
      <main className="content" ref={ref}>
        <BentoGrid widgets={widgets} />
        <ProjectRail projects={projects} />
      </main>
    )
  },
)
