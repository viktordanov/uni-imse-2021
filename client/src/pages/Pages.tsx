import { APIEndpoints, makeRequest } from '@/api'
import { Button } from '@/components/button'
import { FormInput } from '@/components/formInput'
import { IconButton } from '@/components/iconButton'
import { Modal } from '@/components/modal'
import { PageCard } from '@/components/pageCard'
import { Placeholder } from '@/components/placeholder'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import modalStyles from '@/styles/components/modal.module.scss'
import styles from '@/styles/pages/studentPages.module.scss'
import c from 'classnames'
import React, { useCallback, useState } from 'react'
import { Plus } from 'react-feather'

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
  const [pages, refetchPages] = useRequest<Page[]>([], APIEndpoints.getPages)

  const [modalIsOpen, setIsOpen] = React.useState(false)
  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const [pageTitle, setPageTitle] = useState('')
  const [description, setDescription] = useState('')
  const handleNewPage = useCallback(() => {
    makeRequest(APIEndpoints.newPage, 'post', { title: pageTitle, description }, token ?? '').then(res => {
      if (res.ok) {
        closeModal()
        pushNotification(NotificationType.SUCCESS, 'New page', 'Successfully added new page', 2000)
        refetchPages()
      } else {
        pushNotification(NotificationType.ERROR, 'Error', 'Unknown error occurred ' + res.statusText, 2000)
      }
    })
  }, [pageTitle, description, token])
  const handlePageDelete = useCallback(
    (pageTitle: string) => {
      makeRequest(APIEndpoints.deletePage, 'delete', { title: pageTitle }, token ?? '').then(res => {
        if (res.ok) {
          pushNotification(NotificationType.SUCCESS, 'Success', 'Successfully delete page', 2000)
          refetchPages()
        } else {
          pushNotification(NotificationType.ERROR, 'Error', 'Unknown error occurred ' + res.statusText, 2000)
        }
      })
    },
    [token]
  )
  return (
    <div className={c(styles.studentPages, className)} onClick={onClick}>
      <div className={styles.header}>
        <h1>Your pages</h1>
        <IconButton
          Icon={Plus}
          onClick={() => {
            openModal()
          }}
        >
          New page
        </IconButton>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName={modalStyles.modalOverlay}
        title="New page"
      >
        <FormInput
          className={styles.formInput}
          value={pageTitle}
          onChange={e => setPageTitle(e.currentTarget.value)}
          label={'page title'}
        />
        <FormInput
          className={styles.formInput}
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
          label={'description'}
        />
        <Button className={styles.right} onClick={handleNewPage}>
          Add page
        </Button>
      </Modal>
      <div className={styles.pages}>
        <div className={styles.pagesWrapper}>
          {pages.length > 0 &&
            pages.map((page, index) => {
              return (
                <PageCard
                  onDeleteClick={() => handlePageDelete(page.title)}
                  className={styles.pageCard}
                  pageTitle={page.title}
                  description={page.description}
                  postCount={page.postCount}
                  key={index}
                />
              )
            })}
          {pages.length === 0 && (
            <Placeholder>
              <p>You don't have any pages yet.</p>
            </Placeholder>
          )}
        </div>
      </div>
    </div>
  )
}
