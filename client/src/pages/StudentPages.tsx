import { APIEndpoints } from '@/api'
import { IconButton } from '@/components/iconButton'
import { PageCard } from '@/components/pageCard'
import { Placeholder } from '@/components/placeholder'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentPages.module.scss'
import { Page, Student } from '@/types'
import c from 'classnames'
import React from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory, useParams } from 'react-router-dom'

export interface StudentPagesProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const StudentPages: React.FunctionComponent<StudentPagesProps> = ({ className, onClick }: StudentPagesProps) => {
  const { studentEmail } = useParams<{ studentEmail: string }>()
  const { goBack, push } = useHistory()
  const [studentInfo] = useRequest<Student>(
    { email: '', name: '', university: '' },
    APIEndpoints.getStudentInfo(decodeURI(studentEmail))
  )
  const [pages] = useRequest<Page[]>([], APIEndpoints.getPagesOfStudent(decodeURI(studentEmail)))

  return (
    <div className={c(styles.studentPages, className)} onClick={onClick}>
      <div className={styles.pages}>
        <div className={styles.pagesWrapper}>
          {pages.length > 0 && (
            <>
              <div className={styles.header}>
                <h1>
                  {studentInfo.name}'s pages ({pages.length})
                </h1>
                <IconButton Icon={ChevronLeft} onClick={goBack}>
                  Back
                </IconButton>
              </div>
              {pages.map((page, index) => {
                return (
                  <PageCard
                    className={styles.pageCard}
                    pageTitle={page.title}
                    description={page.description}
                    postCount={page.postCount}
                    onClick={() => push('/students/' + studentEmail + '/' + encodeURI(page.title))}
                    key={index}
                  />
                )
              })}
            </>
          )}
          {pages.length === 0 && (
            <Placeholder>
              <p>{studentInfo.name} doesn't have any pages yet.</p>
            </Placeholder>
          )}
        </div>
      </div>
    </div>
  )
}
