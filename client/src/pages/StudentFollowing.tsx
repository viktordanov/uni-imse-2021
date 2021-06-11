import styles from '@/styles/pages/studentFollowing.module.scss'
import React, { useMemo, useState } from 'react'
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
  const allStudents = useRequest<Student[]>([], APIEndpoints.getAllStudents)
  const followedStudents = useRequest<Student[]>([], APIEndpoints.getFollowed)

  const [manuallyFollowed, setManuallyFollowed] = useState<Student[]>([])

  const followed = useMemo<Student[]>(() => {
    return [...followedStudents, ...manuallyFollowed]
  }, [followedStudents, manuallyFollowed])

  const notFollowed = useMemo<Student[]>(() => {
    return allStudents.filter(s => !followed.includes(s))
  }, [allStudents, followed])

  const [query, setQuery] = useState<string>('')

  const Followed = useMemo(() => {
    if (query === '')
      return (
        <>
          <h1>Who you're following</h1>
          <div className={styles.followedWrapper}>
            {followed.length > 0 &&
              followed.map((student, index) => {
                return <PersonBadge className={styles.followedBadge} mode="full" name={student.name} key={index} />
              })}
            {followed.length === 0 && <p>You aren't following anybody yet.</p>}
          </div>
        </>
      )
    const matching = notFollowed.filter(
      nF => matches(nF.name, query) || matches(nF.email, query) || matches(nF.university, query)
    )
    return (
      <>
        <h1>Search results</h1>
        <div className={styles.followedWrapper}>
          {matching.length > 0 &&
            matching.map((student, index) => {
              return <PersonBadge className={styles.followedBadge} mode="full" name={student.name} key={index} />
            })}
          {matching.length === 0 && <p>No students found.</p>}
        </div>
      </>
    )
  }, [followed, query, notFollowed])

  return (
    <div className={c(styles.studentFollowing, className)} onClick={onClick}>
      <h1>Find students to follow</h1>
      <IconInput
        className={styles.input}
        iconClassName={styles.icon}
        wrapperClassName={styles.iconInput}
        Icon={Search}
        value={query}
        onChange={e => setQuery(e.currentTarget.value)}
      />
      {Followed}
    </div>
  )
}

function matches(first: string, query: string): boolean {
  return first.toLowerCase().includes(query.toLowerCase())
}
