import styles from '@/styles/pages/debug.module.scss'
import React from 'react'
import c from 'classnames'
import { PersonBadge } from '@/components/personBadge'

export interface DebugProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Debug: React.FunctionComponent<DebugProps> = ({ className, onClick }: DebugProps) => {
  return (
    <div className={c(styles.debug, className)} onClick={onClick}>
      <PersonBadge name="Thomas Angeland" mode="full" />
      <PersonBadge name="Thomas eland" mode="full" />
      <PersonBadge name="Phoebe Buffet" mode="full" />
      <PersonBadge name="Matt LeBlanc" mode="full" />
      <PersonBadge name="Matt LBlanc" mode="full" />
      <PersonBadge name="Matt LeBzxca" mode="full" />
      <PersonBadge name="Matt LeBzxca" mode="full" />
      <PersonBadge name="Thomas Angeland" mode="compact" />
      <PersonBadge name="Phoebe Buffet" mode="compact" />
      <PersonBadge name="Matt LeBlanc" mode="compact" />
      <PersonBadge name="Thomas Angeland" mode="profile" />
      <PersonBadge name="Phoebe Buffet" mode="profile" />
      <PersonBadge name="Matt LeBlanc" mode="profile" />
    </div>
  )
}
