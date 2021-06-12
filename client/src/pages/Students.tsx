import { APIEndpoints, makeRequest } from '@/api'
import { IconInput } from '@/components/iconInput'
import { PersonBadge } from '@/components/personBadge'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentFollowing.module.scss'
import { Student } from '@/types'
import c from 'classnames'
import React, { useMemo, useState } from 'react'
import { Search, UserMinus, UserPlus } from 'react-feather'

export interface StudentsProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Students: React.FunctionComponent<StudentsProps> = ({ className, onClick }: StudentsProps) => {
  const { token } = useAuth()
  const { pushNotification } = useNotifications()
  const [allStudents] = useRequest<Student[]>([], APIEndpoints.getAllStudents)
  const [followedStudents, refetchFollowed] = useRequest<Student[]>([], APIEndpoints.getFollowed)

  const notFollowed = useMemo<Student[]>(() => {
    return allStudents.filter(s => !followedStudents.find(st => st.email === s.email))
  }, [allStudents, followedStudents])

  const [query, setQuery] = useState<string>('')

  const follow = (email: string): void => {
    makeRequest(APIEndpoints.follow, 'post', { email }, token ?? '').then(res => {
      if (res.ok) {
        refetchFollowed()
        pushNotification(NotificationType.SUCCESS, 'Success', 'Student followed', 1500)
      } else {
        pushNotification(NotificationType.ERROR, 'Error', 'Unknown error occurred', 1500)
      }
    })
  }

  const unfollow = (email: string): void => {
    makeRequest(APIEndpoints.unfollow, 'post', { email }, token ?? '').then(res => {
      if (res.ok) {
        refetchFollowed()
        pushNotification(NotificationType.SUCCESS, 'Success', 'Student unfollowed', 1500)
      } else {
        pushNotification(NotificationType.ERROR, 'Error', 'Unknown error occurred', 1500)
      }
    })
  }

  const Followed = useMemo(() => {
    if (query === '')
      return (
        <>
          <h1>Who you're following</h1>
          <div className={styles.followedWrapper}>
            {followedStudents.length > 0 &&
              followedStudents.map((student, index) => {
                return (
                  <PersonBadge
                    className={styles.followedBadge}
                    mode="full"
                    other={student.university}
                    name={student.name}
                    key={index}
                    Icon={UserMinus}
                    onClick={() => unfollow(student.email)}
                  />
                )
              })}
            {followedStudents.length === 0 && <p>You aren't following anybody yet.</p>}
          </div>
        </>
      )
    const matching = notFollowed.filter(nF => matches(nF.name, query) || matches(nF.university, query))
    return (
      <>
        <h1>Search results ({matching.length === 0 ? 'none' : matching.length})</h1>
        <div className={styles.followedWrapper}>
          {matching.length > 0 &&
            matching.map((student, index) => {
              return (
                <PersonBadge
                  className={styles.followedBadge}
                  other={student.university}
                  mode="full"
                  name={student.name}
                  key={query + index}
                  Icon={UserPlus}
                  onClick={() => follow(student.email)}
                />
              )
            })}
          {matching.length === 0 && <p>No students found.</p>}
        </div>
      </>
    )
  }, [followedStudents, query, notFollowed])

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
