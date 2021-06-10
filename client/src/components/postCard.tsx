import styles from '@/styles/components/postCard.module.scss'
import React, { useMemo } from 'react'
import c from 'classnames'

export interface PostCardProps {
  className?: string
  onClick?: () => void
  ownerName: string
  pageTitle: string
  title: string
  content: string
  dateCreated: Date
}

export const PostCard: React.FunctionComponent<PostCardProps> = ({
  className,
  onClick,
  ownerName,
  pageTitle,
  title,
  content,
  dateCreated
}: PostCardProps) => {
  const dateString = useMemo(() => {
    if (dateCreated === null || dateCreated === undefined) return ''
    const year = dateCreated.getFullYear()
    const month = dateCreated.getMonth()
    const date = dateCreated.getDate()
    let hours = dateCreated.getHours()
    const minutes = dateCreated.getMinutes()
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
  }, [dateCreated])
  return (
    <div className={c(styles.postCard, className)} onClick={onClick}>
      <p className={styles.ownerAndPage}>
        {ownerName}
        <span>/</span>
        {pageTitle}
      </p>
      <p className={styles.postTitle}>{title}</p>
      <p className={styles.content}>{content}</p>

      <p className={styles.date}>{dateString}</p>
    </div>
  )
}
