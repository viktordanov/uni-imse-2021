import styles from '@/styles/components/placeholder.module.scss'
import React, { ReactNode } from 'react'
import c from 'classnames'

export interface PlaceholderProps {
  className?: string
  children: ReactNode
}

export const Placeholder: React.FunctionComponent<PlaceholderProps> = ({ className, children }: PlaceholderProps) => {
  return <div className={c(styles.placeholder, className)}>{children}</div>
}
