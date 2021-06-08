import styles from '@/styles/components/logo.module.scss'
import React from 'react'
import c from 'classnames'
import LOGO_SVG from 'assets/logo.svg'

export interface LogoProps {
  className?: string
}

export const Logo: React.FunctionComponent<LogoProps> = ({ className }: LogoProps) => {
  return (
    <div className={c(styles.logo, className)}>
      <img className={styles.logoImg} src={LOGO_SVG} />
      <div className={styles.logoText}>
        <p className={styles.name}>Conligo</p>
        <p className={styles.moto}>Connect with your fellow students</p>
      </div>
      <div className="clearfix"></div>
    </div>
  )
}
