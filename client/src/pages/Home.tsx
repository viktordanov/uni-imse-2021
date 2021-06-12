import { APIEndpoints } from '@/api'
import { PageCard } from '@/components/pageCard'
import { PersonBadge } from '@/components/personBadge'
import { Placeholder } from '@/components/placeholder'
import { PostCard } from '@/components/postCard'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentHome.module.scss'
import { Page, Post, Student } from '@/types'
import c from 'classnames'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

export interface HomeProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Home: React.FunctionComponent<HomeProps> = ({ className, onClick }: HomeProps) => {
  const { decodedToken } = useAuth()
  const [followedStudents] = useRequest<Student[]>([], APIEndpoints.getFollowed)
  const { push } = useHistory()
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
              return (
                <PersonBadge
                  onClick={() => push('/students/' + encodeURI(student.email))}
                  className={styles.followedBadge}
                  mode="compact"
                  name={student.name}
                  key={index}
                />
              )
            })}
          {followedStudents.length === 0 && (
            <Placeholder>
              <p>
                You aren't following anybody yet.
                <br />
                <Link className={styles.link} to="/students">
                  Find students to follow
                </Link>
              </p>
            </Placeholder>
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
            <Placeholder>
              <p>
                Your feed is empty. Follow more students to enrich your feed!
                <br />
                <Link className={styles.link} to="/students">
                  Discover other students
                </Link>
              </p>
            </Placeholder>
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
                  onClick={() =>
                    push('/students/' + ((decodedToken?.sub as any)?.email ?? '') + '/' + encodeURI(page.title))
                  }
                  key={index}
                />
              )
            })}
          {pages.length === 0 && (
            <Placeholder>
              <p>
                You don't have any pages yet.
                <br />
                <Link className={styles.link} to="/pages">
                  Make a new page
                </Link>
              </p>
            </Placeholder>
          )}
        </div>
      </div>
    </div>
  )
}
