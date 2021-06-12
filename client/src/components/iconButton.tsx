import styles from '@/styles/components/iconButton.module.scss'
import c from 'classnames'
import React from 'react'
import { Icon } from 'react-feather'

export interface IconButtonProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  Icon: Icon
  children: string
}

export const IconButton: React.FunctionComponent<IconButtonProps> = ({
  className,
  onClick,
  Icon,
  children
}: IconButtonProps) => {
  return (
    <div className={c(styles.iconButton, className)} onClick={onClick}>
      <Icon className={c(styles.icon)} />
      <label>{children}</label>
    </div>
  )
}
