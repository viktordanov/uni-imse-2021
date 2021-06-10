/* SPDX-License-Identifier: UNLICENSED 
/* Copyright © 2019 Annorum Viktor Danov. All rights reserved.  */

import React, { ReactNode, useContext, useReducer } from 'react'

// Types
export enum NotificationType {
  SUCCESS = 0,
  INFO,
  WARNING,
  ERROR,
  DEBUG
}
export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
}

interface Action {
  type: 'push' | 'remove_id'
  payload: Notification
}

type Push = (type: NotificationType, title: string, message: string, timeout: number) => void
const NotifierContext = React.createContext<[Notification[], Push] | undefined>(undefined)

const notificationReducer = (state: Notification[], action: Action): Notification[] => {
  if (action.type === 'push') {
    return [...state, action.payload]
  } else if (action.type === 'remove_id') {
    return [...state].filter(n => n.id != action.payload.id)
  }
  return state
}

function useNotifyContext(): [Notification[], Push] {
  const context = useContext(NotifierContext)
  // Check if caller component is within a NotifierContext.Provider
  if (context === undefined) {
    throw new Error('useNotify must be within	a NotifierContext')
  }
  return context
}

export function useNotifications(): { notifications: Notification[]; pushNotification: Push } {
  const [notifications, pushNotification] = useNotifyContext()
  return { notifications, pushNotification }
}

interface Props {
  children?: ReactNode
}

export const NotifyProvider: React.FunctionComponent<Props> = ({ children }: Props) => {
  const [notifications, dispatch] = useReducer(notificationReducer, [] as Notification[])

  const pushNotification: Push = (type: NotificationType, title: string, message: string, timeout: number) => {
    const idToPush = Math.random().toString(36).substr(2, 9)
    dispatch({
      type: 'push',
      payload: {
        id: idToPush,
        title,
        message,
        type
      }
    })

    setTimeout(() => {
      dispatch({
        type: 'remove_id',
        payload: {
          // TODO: consider alternate payload type
          id: idToPush,
          title: '',
          message: '',
          type: NotificationType.DEBUG
        }
      })
    }, timeout)
  }

  return <NotifierContext.Provider value={[notifications, pushNotification]}>{children}</NotifierContext.Provider>
}
