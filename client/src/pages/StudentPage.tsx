import { APIEndpoints } from '@/api'
import { IconButton } from '@/components/iconButton'
import { PageCard } from '@/components/pageCard'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentPage.module.scss'
import c from 'classnames'
import React from 'react'
import { Plus } from 'react-feather'

type Page = {
  title: string
  description: string
  dateCreated: Date
  postCount: number
}

export interface StudentPageProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const StudentPage: React.FunctionComponent<StudentPageProps> = ({ className, onClick }: StudentPageProps) => {
  const { token } = useAuth()
  const { pushNotification } = useNotifications()
  const [pages] = useRequest<Page[]>([], APIEndpoints.getPages)

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

      <div className={styles.pages}>
        <div className={styles.pagesWrapper}>
          {pages.length > 0 &&
            pages.push(...pages) &&
            pages.push(...pages) &&
            pages.push(...pages) &&
            pages.push(...pages) &&
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
