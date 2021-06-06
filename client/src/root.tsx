import React from 'react'
import c from 'classnames'

export interface RootProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Root: React.FunctionComponent<RootProps> = ({ className, onClick }: RootProps) => {
  return (
    <div className={c(className)} onClick={onClick}>
      <p>Testo</p>
    </div>
  )
}
