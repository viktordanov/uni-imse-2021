import styles from '@/styles/pages/debug.module.scss'
import React from 'react'
import c from 'classnames'
import { PersonBadge } from '@/components/personBadge'
import { PageCard } from '@/components/pageCard'
import { PostCard } from '@/components/postCard'

export interface DebugProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Debug: React.FunctionComponent<DebugProps> = ({ className, onClick }: DebugProps) => {
  return (
    <div className={c(styles.debug, className)} onClick={onClick}>
      <PageCard
        pageTitle="Test title"
        postCount={0}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />
      <PageCard
        pageTitle="Test title"
        postCount={0}
        onDeleteClick={() => {
          alert()
        }}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />
      <PostCard
        owner="Viktor Danov"
        pageTitle="Thoughts"
        postTitle="Thought on the universal item sorting system"
        dateOfCreation={new Date()}
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />
    </div>
  )
}
