import styles from '@/styles/components/iconInput.module.scss'
import React from 'react'
import c from 'classnames'
import { Icon } from 'react-feather'
import { Input } from './input'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  Icon: Icon
  iconClassName?: string
  wrapperClassName?: string
}

export const IconInput = React.forwardRef<HTMLInputElement, InputProps>(function IconInput(
  { Icon, wrapperClassName, iconClassName, ...props }: InputProps,
  ref
) {
  return (
    <div className={c(styles.iconInput, wrapperClassName)}>
      <Icon className={c(styles.icon, iconClassName)} />
      <Input {...props} ref={ref} className={c(styles.input, props.className)}></Input>
    </div>
  )
})
