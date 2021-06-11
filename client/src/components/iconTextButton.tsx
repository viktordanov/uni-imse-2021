import styles from '@/styles/components/iconTextButton.module.scss'
import React from 'react'
import c from 'classnames'
import { Icon } from 'react-feather'
import { Button } from './button'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  //type InputProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  Icon: Icon
  iconClassName?: string
  wrapperClassName?: string
}
export const IconTextButton = React.forwardRef<HTMLButtonElement, InputProps>(function IconTextButton(
  { Icon, wrapperClassName, iconClassName, ...props }: InputProps,
  ref
) {
  return (
    <div {...props} className={c(styles.iconTextButton, wrapperClassName)}>
      <Icon className={c(styles.icon, iconClassName)} />
      <label>{props.value}</label>
    </div>
  )
})
