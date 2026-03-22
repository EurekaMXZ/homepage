interface HeroWordmarkProps {
  semanticName: string
}

export function HeroWordmark({ semanticName }: HeroWordmarkProps) {
  return <h1 className="name hero-gradient-text">{semanticName}</h1>
}
