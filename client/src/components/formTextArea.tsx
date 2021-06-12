import styles from '@/styles/components/formInput.module.scss'
import textAreaStyles from '@/styles/components/textArea.module.scss'
import React from 'react'
import c from 'classnames'

type FormTextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label: string
}

export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(function FormTextArea(
  { ...props }: FormTextAreaProps,
  ref
) {
  return (
    <div className={c(props.className, styles.formInput)}>
      <label>{props.label}</label>
      <textarea {...props} className={c(props.className, textAreaStyles.textArea)} ref={ref} />
    </div>
  )
})
