/* SPDX-License-Identifier: UNLICENSED 
/* Copyright © 2019 Annorum Viktor Danov. All rights reserved.  */

import { Notification, useNotifications } from '@/context/notifierContext'
import styles from '@/styles/components/notifier/notifier.module.scss'
import React, { FunctionComponent } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const notificationsDOM = document.getElementById('notifications') as HTMLElement // We know it's there

export const Notifier: FunctionComponent = () => {
  const { notifications } = useNotifications()
  return createPortal(
    <div className={styles.notificationWrapper}>
      <TransitionGroup component={null}>
        {notifications.map((value: Notification) => {
          return (
            <CSSTransition
              key={value.id}
              timeout={250}
              classNames={{
                enter: styles.nEnter,
                exit: styles.nExit,
                enterActive: styles.nEnterActive,
                exitActive: styles.nExitActive
              }}
            >
              <div className={styles.notification + ' ' + styles['type' + value.type]}>
                <div className={styles.label}>{value.title}</div>
                <div className={styles.message}>{value.message}</div>
              </div>
            </CSSTransition>
          )
        })}
      </TransitionGroup>
    </div>,
    notificationsDOM
  )
}
