import styles from '@/styles/components/pageCard.module.scss'
import React, { useMemo } from 'react'
import c from 'classnames'

export interface PageCardProps {
  className?: string
  pageTitle: string
  description: string
  postCount: number
  onClick?: () => void
}

export const PageCard: React.FunctionComponent<PageCardProps> = ({
  className,
  onClick,
  pageTitle,
  description,
  postCount
}: PageCardProps) => {
  const postLabel = useMemo(() => {
    if (postCount == 1) return '1 post'
    return postCount + ' posts'
  }, [postCount])
  return (
    <div className={c(styles.pageCard, className)} onClick={onClick}>
      <p className={styles.postCount}>{postLabel}</p>
      <p className={styles.title}>{pageTitle}</p>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
