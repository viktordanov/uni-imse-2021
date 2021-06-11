import { APIEndpoints } from '@/api'
import { PageCard } from '@/components/pageCard'
import { PersonBadge } from '@/components/personBadge'
import { PostCard } from '@/components/postCard'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentHome.module.scss'
import c from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

export interface StudentHomeProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

type Student = {
  name: string
  email: string
  university: string
}

type Page = {
  title: string
  description: string
  dateCreated: Date
  postCount: number
}

type Post = {
  ownerName: string
  pageTitle: string
  title: string
  content: string
  dateCreated: Date
}

export const StudentHome: React.FunctionComponent<StudentHomeProps> = ({ className, onClick }: StudentHomeProps) => {
  const [followedStudents] = useRequest<Student[]>([], APIEndpoints.getFollowed)
  const [feedPosts] = useRequest<Post[]>([], APIEndpoints.getFeed, {}, (data: any): Post => {
    return data.map((d: any) => {
      return {
        ownerName: d.ownerName,
        pageTitle: d.pageTitle,
        title: d.title,
        content: d.content,
        dateCreated: new Date(d.dateCreated)
      }
    })
  })
  const [pages] = useRequest<Page[]>([], APIEndpoints.getPages)
  return (
    <div className={c(styles.studentHome, className)} onClick={onClick}>
      <div className={styles.following}>
        <label>Who you're following</label>
        <div className={styles.followingWrapper}>
          {followedStudents.length > 0 &&
            followedStudents.map((student, index) => {
              return <PersonBadge className={styles.followedBadge} mode="compact" name={student.name} key={index} />
            })}
          {followedStudents.length === 0 && (
            <p>
              You aren't following anybody yet.
              <br />
              <Link className={styles.link} to="/following">
                Find students to follow
              </Link>
            </p>
          )}
        </div>
      </div>
      <div className={styles.feed}>
        <label>New from your followers</label>
        <div className={styles.feedWrapper}>
          {feedPosts.length > 0 &&
            feedPosts.map((post, index) => {
              return (
                <PostCard
                  className={styles.postCard}
                  content={post.content}
                  dateCreated={post.dateCreated}
                  ownerName={post.ownerName}
                  pageTitle={post.pageTitle}
                  title={post.title}
                  key={index}
                />
              )
            })}
          {feedPosts.length === 0 && (
            <p>
              Your feed is empty. Follow more students to enrich your feed!
              <br />
              <Link className={styles.link} to="/following">
                Discover other students
              </Link>
            </p>
          )}
        </div>
      </div>
      <div className={styles.pages}>
        <label>Your pages</label>
        <div className={styles.pagesWrapper}>
          {pages.length > 0 &&
            pages.map((page, index) => {
              return (
                <PageCard
                  className={styles.pageCard}
                  pageTitle={page.title}
                  description={page.description}
                  postCount={page.postCount}
                  key={index}
                />
              )
            })}
          {pages.length === 0 && (
            <p>
              You don't have any pages yet.
              <br />
              <Link className={styles.link} to="/pages">
                Make a new page
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
