import { APIEndpoints, makeRequest } from '@/api'
import { PageCard } from '@/components/pageCard'
import { PersonBadge } from '@/components/personBadge'
import { Placeholder } from '@/components/placeholder'
import { PostCard } from '@/components/postCard'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentHome.module.scss'
import { Page, Post, Student } from '@/types'
import c from 'classnames'
import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'

export interface HomeProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Home: React.FunctionComponent<HomeProps> = ({ className, onClick }: HomeProps) => {
  const { token, decodedToken } = useAuth()
  const { pushNotification } = useNotifications()
  const [followedStudents] = useRequest<Student[]>([], APIEndpoints.getFollowed)
  const { push } = useHistory()
  const [feedPosts] = useRequest<Post[]>([], APIEndpoints.getFeed, {}, (data: any): Post => {
    return data.map((d: any) => {
      return {
        ownerName: d.ownerName,
        ownerEmail: d.ownerEmail,
        pageTitle: d.pageTitle,
        title: d.title,
        content: d.content,
        dateCreated: new Date(d.dateCreated)
      }
    })
  })
  const [pages] = useRequest<Page[]>([], APIEndpoints.getPages)

  const [likedPosts, refetchLikes] = useRequest<Post[]>([], APIEndpoints.getLiked, {}, (data: any): Post => {
    return data.map((d: any) => {
      return {
        title: d.title,
        content: d.content,
        dateCreated: new Date(d.dateCreated)
      }
    })
  })

  const isPostLiked = useCallback(
    (post: Post): boolean => {
      return (
        likedPosts.findIndex(p => {
          return (
            p.content === post.content &&
            p.dateCreated.getTime() === post.dateCreated.getTime() &&
            p.title === post.title
          )
        }) !== -1
      )
    },
    [likedPosts]
  )
  const handleLike = useCallback(
    (post: Post) => {
      const liked = isPostLiked(post)
      if (!liked) {
        makeRequest(
          APIEndpoints.likePost,
          'post',
          { postOwnerAddress: post.ownerEmail, postTitle: post.title, pageTitle: post.pageTitle },
          token ?? ''
        ).then(res => {
          if (res.ok) {
            pushNotification(NotificationType.INFO, post.title, 'Post liked', 2000)
            refetchLikes()
          } else {
            pushNotification(NotificationType.ERROR, 'Error', 'Something went wrong ' + res.statusText, 2000)
          }
        })
      } else {
        makeRequest(
          APIEndpoints.unlikePost,
          'post',
          { postOwnerAddress: post.ownerEmail, postTitle: post.title, pageTitle: post.pageTitle },
          token ?? ''
        ).then(res => {
          if (res.ok) {
            pushNotification(NotificationType.INFO, post.title, 'Post like removed', 2000)
            refetchLikes()
          } else {
            pushNotification(NotificationType.ERROR, 'Error', 'Something went wrong ' + res.statusText, 2000)
          }
        })
      }
    },
    [isPostLiked, refetchLikes, token]
  )

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
        <label>New from the people you follow</label>
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
                  liked={isPostLiked(post)}
                  onClick={() => handleLike(post)}
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
