import styles from '@/styles/pages/studentFollowing.module.scss'
import React from 'react'
import c from 'classnames'
import { IconInput } from '@/components/iconInput'
import { Search } from 'react-feather'
import { useRequest } from '@/hooks/useRequest'
import { APIEndpoints } from '@/api'
import { PersonBadge } from '@/components/personBadge'

type Student = {
  name: string
  email: string
  university: string
}

export interface StudentFollowingProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const StudentFollowing: React.FunctionComponent<StudentFollowingProps> = ({
  className,
  onClick
}: StudentFollowingProps) => {
  const followedStudents = useRequest<Student[]>([], APIEndpoints.getFollowed)
  return (
    <div className={c(styles.studentFollowing, className)} onClick={onClick}>
      <h1>Find students to follow</h1>
      <IconInput
        className={styles.input}
        iconClassName={styles.icon}
        wrapperClassName={styles.iconInput}
        Icon={Search}
      />
      <h1>Who you're following</h1>
      <div className={styles.followedWrapper}>
        {followedStudents.length > 0 &&
          followedStudents.map((student, index) => {
            return <PersonBadge className={styles.followedBadge} mode="full" name={student.name} key={index} />
          })}
        {followedStudents.length === 0 && <p>You aren't following anybody yet.</p>}
      </div>
    </div>
  )
}
