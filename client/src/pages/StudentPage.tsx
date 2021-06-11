import { APIEndpoints, makeRequest } from '@/api'
import { IconInput } from '@/components/iconInput'
import { IconTextButton } from '@/components/iconTextButton'
import { PageCard } from '@/components/pageCard'
import { PersonBadge } from '@/components/personBadge'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentPage.module.scss'
import c from 'classnames'
import React, { useMemo, useState } from 'react'
import { UserMinus, UserPlus, Plus } from 'react-feather'

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

  const Pages = useMemo(() => {
    return (
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
    )
  }, [pages])

  return (
    <div className={c(styles.studentFollowing, className)} onClick={onClick}>
      <h1>Your pages</h1>
      <IconTextButton
        iconClassName={styles.icon}
        wrapperClassName={styles.iconText}
        Icon={Plus}
        value={'new page'}
        onClick={() => {
          console.log('jamoin')
        }}
      />
      {Pages}
    </div>
  )
}
