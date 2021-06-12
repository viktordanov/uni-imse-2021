import styles from '@/styles/components/pageCard.module.scss'
import React, { useMemo } from 'react'
import c from 'classnames'
import { Trash } from 'react-feather'

export interface PageCardProps {
  className?: string
  pageTitle: string
  description: string
  postCount: number
  onClick?: () => void
  onDeleteClick?: () => void
}

export const PageCard: React.FunctionComponent<PageCardProps> = ({
  className,
  onClick,
  onDeleteClick,
  pageTitle,
  description,
  postCount
}: PageCardProps) => {
  const postLabel = useMemo(() => {
    if (postCount == 1) return '1 post'
    return postCount + ' posts'
  }, [postCount])
  return (
    <div
      className={c(styles.pageCard, className, { [styles.hasDeleteAction]: onDeleteClick !== undefined })}
      onClick={onClick}
    >
      {onDeleteClick && (
        <Trash
          className={styles.icon}
          size="16"
          onClick={e => {
            onDeleteClick?.()
            e.stopPropagation()
          }}
        />
      )}
      <p className={styles.title}>{pageTitle}</p>
      <p className={styles.postCount}>{postLabel}</p>
      <div className="clearfix"></div>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
