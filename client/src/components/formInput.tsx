import styles from '@/styles/components/formInput.module.scss'
import React from 'react'
import c from 'classnames'
import { Input } from './input'

type FormInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { ...props }: FormInputProps,
  ref
) {
  return (
    <div className={c(props.className, styles.formInput)}>
      <label>{props.label}</label>
      <Input {...props} ref={ref} />
    </div>
  )
})
