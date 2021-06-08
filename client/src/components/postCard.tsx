import styles from '@/styles/components/postCard.module.scss'
import React, { useMemo } from 'react'
import c from 'classnames'

export interface PostCardProps {
  className?: string
  onClick?: () => void
  owner: string
  pageTitle: string
  postTitle: string
  content: string
  dateOfCreation: Date
}

export const PostCard: React.FunctionComponent<PostCardProps> = ({
  className,
  onClick,
  owner,
  pageTitle,
  postTitle,
  content,
  dateOfCreation
}: PostCardProps) => {
  const dateString = useMemo(() => {
    const year = dateOfCreation.getFullYear()
    const month = dateOfCreation.getMonth()
    const date = dateOfCreation.getDate()
    let hours = dateOfCreation.getHours()
    const minutes = dateOfCreation.getMinutes()
    const midday = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    return (
      <>
        <span>
          {year} / {(month + '').padStart(2, '0')} / {(date + '').padStart(2, '0')}
        </span>
        <span>
          {(hours + '').padStart(2, '0')}:{(minutes + '').padStart(2, '0')} {midday}
        </span>
      </>
    )
  }, [dateOfCreation])
  return (
    <div className={c(styles.postCard, className)} onClick={onClick}>
      <p className={styles.ownerAndPage}>
        {owner}
        <span>/</span>
        {pageTitle}
      </p>
      <p className={styles.postTitle}>{postTitle}</p>
      <p className={styles.content}>{content}</p>

      <p className={styles.date}>{dateString}</p>
    </div>
  )
}
