import { APIEndpoints, makeRequest } from '@/api'
import { AdminMenu } from '@/components/adminMenu'
import { IconButton } from '@/components/iconButton'
import { Input } from '@/components/input'
import { Logo } from '@/components/logo'
import { PersonBadge } from '@/components/personBadge'
import { Placeholder } from '@/components/placeholder'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest, useRequestArg } from '@/hooks/useRequest'
import styles from '@/styles/pages/admin.module.scss'
import { ReportFamousStudents, ReportStudentActivity } from '@/types'
import c from 'classnames'
import React, { useCallback, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Codepen } from 'react-feather'

type UserInfo = {
  name: string
  email: string
  accountType: 'admin' | 'student'
}

export interface AdminProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Admin: React.FunctionComponent<AdminProps> = ({ className, onClick }: AdminProps) => {
  const { token, decodedToken } = useAuth()

  const [filterWeeks, setFilterWeeks] = useState(5)
  const [filterTitles, setFilterTitles] = useState('sit')

  const [hasMigrated, refetchHasMigrated] = useRequest<boolean>(true, APIEndpoints.hasMigrated)
  const [reportStudentActivity, refetchReport1] = useRequestArg<ReportStudentActivity[]>(
    [],
    APIEndpoints.report1,
    filterWeeks
  )
  const [reportFamousStudents, refetchReport2] = useRequestArg<ReportFamousStudents[]>(
    [],
    APIEndpoints.report2,
    filterTitles
  )

  const [activitySortMode, setActivitySortMode] = useState<'student name-asc' | 'student name-desc'>('student name-asc')
  const [famousSortMode, setFamousSortMode] =
    useState<'likes-asc' | 'likes-desc' | 'followers-asc' | 'followers-desc'>('likes-desc')

  const { pushNotification } = useNotifications()

  const userInfo = useMemo<UserInfo>(() => {
    const subObj = decodedToken?.sub as any

    return { name: subObj.name ?? '', email: subObj.email ?? '', accountType: 'admin' }
  }, [decodedToken])

  const cycleActivitySort = useCallback(() => {
    if (activitySortMode === 'student name-asc') setActivitySortMode('student name-desc')
    else if (activitySortMode === 'student name-desc') setActivitySortMode('student name-asc')
  }, [activitySortMode])

  const cycleFamousSort = useCallback(() => {
    if (famousSortMode === 'followers-asc') setFamousSortMode('likes-desc')
    else if (famousSortMode === 'likes-desc') setFamousSortMode('likes-asc')
    else if (famousSortMode === 'likes-asc') setFamousSortMode('followers-desc')
    else if (famousSortMode === 'followers-desc') setFamousSortMode('followers-asc')
  }, [famousSortMode])

  const sortedActivityReport = useMemo(() => {
    const asc = activitySortMode.split('-')[1] === 'asc'
    return reportStudentActivity.sort((a, b) => {
      if (asc) {
        return a.studentName.localeCompare(b.studentName)
      }
      return b.studentName.localeCompare(a.studentName)
    })
  }, [activitySortMode, reportStudentActivity])

  const sortedFamousReport = useMemo(() => {
    const asc = famousSortMode.split('-')[1] === 'asc'
    const followers = famousSortMode.split('-')[0] === 'followers'
    return reportFamousStudents.sort((a, b) => {
      if (asc) {
        if (followers) return a.studentFollowers - b.studentFollowers
        return a.likes - b.likes
      } else {
        if (followers) return b.studentFollowers - a.studentFollowers
        return b.likes - a.likes
      }
    })
  }, [famousSortMode, reportFamousStudents])
  const handleMigrateToMongo = useCallback(() => {
    makeRequest(APIEndpoints.migrateToMongo, 'get', {}, token ?? '').then(res => {
      if (res.ok) {
        pushNotification(NotificationType.SUCCESS, 'Success', 'Migrated all data to MongoDB', 2000)
        refetchHasMigrated()
        refetchReport1()
        refetchReport2()
      } else {
        pushNotification(NotificationType.ERROR, 'Error', 'Could not migrate', 2000)
      }
    })
  }, [token])

  return (
    <div className={c(styles.adminPanel)}>
      <header>
        <Logo />

        <div className={styles.right}>
          <AdminMenu className={styles.menu} />
          <PersonBadge name={userInfo.name} other={userInfo.email} mode="profile" />
        </div>
      </header>
      <div className={styles.wrapper}>
        <Placeholder className={styles.placeholder}>
          <h1 className={c({ [styles.not]: !hasMigrated })}>
            Database has {hasMigrated ? 'been' : 'not been'} migrated
          </h1>
          {!hasMigrated && (
            <IconButton Icon={Codepen} onClick={handleMigrateToMongo}>
              Migrate to MongoDB
            </IconButton>
          )}
        </Placeholder>
        <div className={styles.header}>
          <label className={styles.label}>Famous students report</label>
          <div className={styles.rightMenu}>
            <Input
              value={filterWeeks}
              type="number"
              min={2}
              max={50}
              onChange={e => setFilterWeeks(e.currentTarget.valueAsNumber)}
            />
            <IconButton
              onClick={cycleActivitySort}
              Icon={activitySortMode.split('-')[1] === 'asc' ? ChevronUp : ChevronDown}
            >
              {'By ' + activitySortMode.split('-')[0]}
            </IconButton>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th title="Field #1">Student name</th>
              <th title="Field #2">Total Page count</th>
              <th title="Field #3">Total Post count</th>
              <th title="Field #4">Liked Posts</th>
            </tr>
          </thead>
          <tbody>
            {sortedActivityReport.map((row, index) => (
              <tr key={index}>
                <td>{row.studentName}</td>
                <td>{row.sumPages}</td>
                <td>{row.sumPosts}</td>
                <td>{row.likedPosts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.header}>
          <label className={styles.label}>Student activity report</label>
          <div className={styles.rightMenu}>
            <Input value={filterTitles} onChange={e => setFilterTitles(e.currentTarget.value)} />
            <IconButton
              onClick={cycleFamousSort}
              Icon={famousSortMode.split('-')[1] === 'asc' ? ChevronUp : ChevronDown}
            >
              {'By ' + famousSortMode.split('-')[0]}
            </IconButton>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th title="Field #1">Student name</th>
              <th title="Field #2">Followers</th>
              <th title="Field #3">Most famous post title</th>
              <th title="Field #4">Page</th>
              <th title="Field #5">Likes</th>
            </tr>
          </thead>
          <tbody>
            {sortedFamousReport.map((row, index) => (
              <tr key={index}>
                <td>{row.studentName}</td>
                <td>{row.studentFollowers}</td>
                <td>{row.title}</td>
                <td>{row.pageTitle}</td>
                <td>{row.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
