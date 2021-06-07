import styles from '@/styles/components/a.module.scss'
import React from 'react'
import c from 'classnames'

type AProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

export const A: React.FunctionComponent<AProps> = ({ children, ...props }: AProps) => {
  return (
    <a {...props} className={c(styles.a, props.className)}>
      {children}
    </a>
  )
}
