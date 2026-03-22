import { ChevronDown } from 'lucide-react'

interface ScrollArrowProps {
  hidden: boolean
  onClick: () => void
}

export function ScrollArrow({ hidden, onClick }: ScrollArrowProps) {
  return (
    <div className="down-arrow" aria-hidden={hidden}>
      <div className="down-arrow-inner" onClick={hidden ? undefined : onClick}>
        <ChevronDown aria-hidden="true" strokeWidth={2.25} />
      </div>
    </div>
  )
}
