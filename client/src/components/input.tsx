import styles from '@/styles/components/input.module.scss'
import React from 'react'
import c from 'classnames'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input: React.FunctionComponent<InputProps> = ({ ...props }: InputProps) => {
  return <input {...props} className={c(styles.input, props.className)}></input>
}
