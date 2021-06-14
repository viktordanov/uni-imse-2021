import { APIEndpoints } from '@/api'
import { AdminMenu } from '@/components/adminMenu'
import { IconButton } from '@/components/iconButton'
import { Logo } from '@/components/logo'
import { PersonBadge } from '@/components/personBadge'
import { Placeholder } from '@/components/placeholder'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/admin.module.scss'
import { ReportFamousStudents, ReportStudentActivity } from '@/types'
import c from 'classnames'
import React, { useMemo } from 'react'
import { Codepen } from 'react-feather'

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
  const { decodedToken } = useAuth()
  const [hasMigrated] = useRequest<boolean>(true, APIEndpoints.hasMigrated)
  const [reportFamousStudents] = useRequest<ReportFamousStudents[]>([], APIEndpoints.report1 + '/6')
  const [reportStudentActivity] = useRequest<ReportStudentActivity[]>([], APIEndpoints.report2 + '/sit')

  const userInfo = useMemo<UserInfo>(() => {
    const subObj = decodedToken?.sub as any

    return { name: subObj.name ?? '', email: subObj.email ?? '', accountType: 'admin' }
  }, [decodedToken])
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
        <Placeholder>
          <h1 className={c({ [styles.not]: !hasMigrated })}>
            Database has {hasMigrated ? 'been' : 'not been'} migrated
          </h1>
          {!hasMigrated && <IconButton Icon={Codepen}>Migrate to MongoDB</IconButton>}
        </Placeholder>
        <label className={styles.label}>Famous students report</label>
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
            {reportFamousStudents.map((row, index) => (
              <tr key={index}>
                <td>{row.studentName}</td>
                <td>{row.sumPages}</td>
                <td>{row.sumPosts}</td>
                <td>{row.likedPosts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <label className={styles.label}>Student activity report</label>
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
            {reportFamousStudents.map((row, index) => (
              <tr key={index}>
                <td>{row.studentName}</td>
                <td>{row.sumPages}</td>
                <td>{row.sumPosts}</td>
                <td>{row.likedPosts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
