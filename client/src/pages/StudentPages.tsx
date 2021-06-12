import { APIEndpoints } from '@/api'
import { IconButton } from '@/components/iconButton'
import { PageCard } from '@/components/pageCard'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentPages.module.scss'
import c from 'classnames'
import React from 'react'
import { Plus } from 'react-feather'

import Modal from 'react-modal'

type Page = {
  title: string
  description: string
  dateCreated: Date
  postCount: number
}

export interface StudentPagesProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const StudentPages: React.FunctionComponent<StudentPagesProps> = ({ className, onClick }: StudentPagesProps) => {
  const { token } = useAuth()
  const { pushNotification } = useNotifications()
  const [pages] = useRequest<Page[]>([], APIEndpoints.getPages)

  const [modalIsOpen, setIsOpen] = React.useState(false)

  return (
    <div className={c(styles.studentPages, className)} onClick={onClick}>
      <div className={styles.header}>
        <h1>Your pages</h1>
        <IconButton
          Icon={Plus}
          onClick={() => {
            pushNotification(NotificationType.INFO, 'test', 'test', 2200)
            console.log('jamoin')
          }}
        >
          New page
        </IconButton>
      </div>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        // style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Hello</h2>
        <button>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
      <div className={styles.pages}>
        <div className={styles.pagesWrapper}>
          {pages.length > 0 &&
            pages.map((page, index) => {
              return (
                <PageCard
                  className={styles.pageCard}
                  pageTitle={page.title}
                  description={page.description}
                  postCount={page.postCount}
                  key={index}
                />
              )
            })}
          {pages.length === 0 && <p>You don't have any pages yet.</p>}
        </div>
      </div>
    </div>
  )
}
