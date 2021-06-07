import styles from '@/styles/components/button.module.scss'
import React from 'react'
import c from 'classnames'

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export const Button: React.FunctionComponent<ButtonProps> = ({ children, ...props }: ButtonProps) => {
  return (
    <button {...props} className={c(styles.button, props.className)}>
      {children}
    </button>
  )
}
