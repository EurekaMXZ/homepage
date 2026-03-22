interface FooterBarProps {
  label: string
  link: string
  sourceLabel: string
}

export function FooterBar({ label, link, sourceLabel }: FooterBarProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {sourceLabel ? (
          <div className="bg-info">
            {label}{' '}
            {link ? (
              <a className="bg-name bg-link" href={link} target="_blank" rel="noreferrer">
                {sourceLabel}
              </a>
            ) : (
              <span className="bg-name">{sourceLabel}</span>
            )}
          </div>
        ) : null}
      </div>
    </footer>
  )
}
