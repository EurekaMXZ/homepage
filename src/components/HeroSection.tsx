import { HeroWordmark } from './HeroWordmark'
import type { ProfileConfig } from '../types'

interface HeroSectionProps {
  profile: ProfileConfig
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <div className="banner-wrap">
      <section className="banner">
        <div className="avatar">
          <img src={profile.avatar} alt="" draggable={false} />
        </div>
        <div className="title">
          <HeroWordmark semanticName={profile.semanticName} />
          <p className="bio hero-gradient-text">{profile.bio}</p>
        </div>
      </section>
    </div>
  )
}
