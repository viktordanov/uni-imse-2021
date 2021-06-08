import styles from '@/styles/components/input.module.scss'
import React from 'react'
import c from 'classnames'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ ...props }: InputProps, ref) {
  return <input {...props} ref={ref} className={c(styles.input, props.className)}></input>
})
