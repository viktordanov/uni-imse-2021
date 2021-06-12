import { APIEndpoints, makeRequest } from '@/api'
import { FormInput } from '@/components/formInput'
import { IconButton } from '@/components/iconButton'
import { Modal } from '@/components/modal'
import { Placeholder } from '@/components/placeholder'
import { PostCard } from '@/components/postCard'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { useRequest } from '@/hooks/useRequest'
import styles from '@/styles/pages/studentPages.module.scss'
import modalStyles from '@/styles/components/modal.module.scss'
import postPageStyles from '@/styles/pages/studentPosts.module.scss'
import { Post, Student } from '@/types'
import c from 'classnames'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Plus } from 'react-feather'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from '@/components/button'
import { FormTextArea } from '@/components/formTextArea'

export interface StudentPostsProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const StudentPosts: React.FunctionComponent<StudentPostsProps> = ({ className, onClick }: StudentPostsProps) => {
  const { token, decodedToken } = useAuth()
  const { pushNotification } = useNotifications()
  const { studentEmail, pageTitle } = useParams<{ studentEmail: string; pageTitle: string }>()
  const { goBack } = useHistory()
  const [studentInfo] = useRequest<Student>(
    { email: '', name: '', university: '' },
    APIEndpoints.getStudentInfo(decodeURI(studentEmail))
  )
  const [posts, refreshPosts] = useRequest<Post[]>(
    [],
    APIEndpoints.getPostsOfStudent(decodeURI(studentEmail), decodeURI(pageTitle)),
    {},
    (data: any): Post => {
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
    }
  )

  const isMe = useMemo(() => (decodedToken?.sub as any)?.email === decodeURI(studentEmail), [])
  const who = useMemo(() => {
    const isMe = (decodedToken?.sub as any)?.email === decodeURI(studentEmail)
    return isMe ? (decodedToken?.sub as any)?.name : studentInfo.name
  }, [studentInfo, decodedToken, studentEmail])

  // Modal
  const [modalIsOpen, setIsOpen] = React.useState(false)
  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const [postTitle, setPostTitle] = useState('')
  const [content, setContent] = useState('')
  const handleNewPost = useCallback(() => {
    if (!titleRef.current?.validity.valid) {
      pushNotification(
        NotificationType.WARNING,
        'Title invalid',
        'Please ensure your title is longer than 3 character',
        3500
      )
      return
    }
    if (!contentRef.current?.validity.valid) {
      pushNotification(
        NotificationType.WARNING,
        'Content invalid',
        'Please ensure your post is longer than 3 character and shorter than 300',
        3500
      )
      return
    }

    makeRequest(APIEndpoints.newPost(pageTitle), 'post', { title: postTitle, content }, token ?? '').then(res => {
      if (res.ok) {
        closeModal()
        pushNotification(NotificationType.SUCCESS, 'Success', 'Successfully added new post', 2000)
        refreshPosts()
      } else {
        pushNotification(NotificationType.ERROR, 'Error', 'Unknown error occurred ' + res.statusText, 2000)
      }
    })
  }, [postTitle, content, token, pageTitle])

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
    <div className={c(styles.studentPages, className)} onClick={onClick}>
      <div className={styles.pages}>
        <div className={c(postPageStyles.wrapper)}>
          <div className={c(styles.header, postPageStyles.header)}>
            <h1>
              {who}
              <span>/</span>
              {decodeURI(pageTitle)}
            </h1>
            <div>
              <IconButton className={postPageStyles.button} Icon={ChevronLeft} onClick={goBack}>
                Back
              </IconButton>
              {isMe && (
                <IconButton className={postPageStyles.button} Icon={Plus} onClick={openModal}>
                  Post
                </IconButton>
              )}
            </div>
          </div>
          {posts.length > 0 && (
            <div className={postPageStyles.postsWrapper}>
              {posts
                .sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime())
                .map((post, index) => {
                  return (
                    <PostCard
                      className={postPageStyles.postCard}
                      pageTitle={pageTitle}
                      title={post.title}
                      dateCreated={post.dateCreated}
                      content={post.content}
                      ownerName={who}
                      liked={isPostLiked(post)}
                      onClick={() => handleLike(post)}
                      key={index}
                    />
                  )
                })}
            </div>
          )}
          {posts.length === 0 && (
            <Placeholder>
              <p>
                {isMe ? "You haven't" : studentInfo.name + " hasn't"} posted anything on page {decodeURI(pageTitle)}{' '}
                yet.
              </p>
            </Placeholder>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName={modalStyles.modalOverlay}
        title="New post"
      >
        <FormInput
          ref={titleRef}
          className={styles.formInput}
          value={postTitle}
          required
          minLength={3}
          maxLength={100}
          onChange={e => setPostTitle(e.currentTarget.value)}
          label={'title'}
        />
        <FormTextArea
          ref={contentRef}
          className={styles.formInput}
          value={content}
          required
          minLength={3}
          maxLength={300}
          onChange={e => setContent(e.currentTarget.value)}
          label={'content'}
        />
        <Button className={styles.right} onClick={handleNewPost}>
          Post
        </Button>
      </Modal>
    </div>
  )
}
