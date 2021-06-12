import styles from '@/styles/components/modal.module.scss'
import React, { ReactNode } from 'react'
import { X } from 'react-feather'
import ReactModal, { defaultStyles } from 'react-modal'

type ModalProps = ReactModal.Props & { children: ReactNode }

export const Modal: React.FunctionComponent<ModalProps> = ({ children, ...props }: ModalProps) => {
  return (
    <ReactModal {...props} overlayClassName={styles.modalOverlay} className={styles.modal}>
      <div className={styles.header}>
        <h1>Hello</h1>
        <X className={styles.closeIcon} onClick={props.onRequestClose} />
      </div>
      {children}
    </ReactModal>
  )
}
