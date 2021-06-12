import styles from '@/styles/components/modal.module.scss'
import React, { ReactNode } from 'react'
import { X } from 'react-feather'
import ReactModal, { defaultStyles } from 'react-modal'

type ModalProps = ReactModal.Props & { children: ReactNode; title: string }

export const Modal: React.FunctionComponent<ModalProps> = ({ children, title, ...props }: ModalProps) => {
  return (
    <ReactModal ariaHideApp={false} {...props} overlayClassName={styles.modalOverlay} className={styles.modal}>
      <div className={styles.header}>
        <h1>{title}</h1>
        <X className={styles.closeIcon} onClick={props.onRequestClose} />
      </div>
      {children}
    </ReactModal>
  )
}
