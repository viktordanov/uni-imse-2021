import { APIEndpoints } from '@/api'
import { A } from '@/components/a'
import { Button } from '@/components/button'
import { FormInput } from '@/components/formInput'
import { Logo } from '@/components/logo'
import { NotificationType, useNotifications } from '@/context/notifierContext'
import { useAuth } from '@/hooks/useAuth'
import { RegexPatterns } from '@/regex'
import styles from '@/styles/pages/login.module.scss'
import c from 'classnames'
import React, { useCallback, useRef, useState } from 'react'
import { useHistory } from 'react-router'

export interface LoginProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Login: React.FunctionComponent<LoginProps> = ({ className, onClick }: LoginProps) => {
  const [mode, setMode] = useState<'login' | 'singup'>('login')
  return (
    <div className={c(styles.login, className)} onClick={onClick}>
      <div className={styles.form}>
        <Logo />
        {mode === 'login' ? (
          <LoginForm onModeSwitch={() => setMode('singup')} />
        ) : (
          <SignUpForm onModeSwitch={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}

interface LoginFormProps {
  className?: string
  onModeSwitch: () => void
}

const LoginForm: React.FunctionComponent<LoginFormProps> = ({ className, onModeSwitch }: LoginFormProps) => {
  const { pushNotification } = useNotifications()

  const { setToken } = useAuth()
  const { push } = useHistory()
  const [email, setEmail] = useState('test@gmail.com')
  const [password, setPassword] = useState('jkdflksjdfklsdjf')

  const refEmail = useRef<HTMLInputElement>(null)
  const refPassword = useRef<HTMLInputElement>(null)

  const handleLogIn = useCallback(async () => {
    if (!refEmail.current?.validity.valid) {
      pushNotification(NotificationType.WARNING, 'Uh-oh!', 'Invalid email', 2000)
      return
    }
    if (!refPassword.current?.validity.valid) {
      pushNotification(NotificationType.WARNING, 'Uh-oh!', 'Password too short', 2000)
      return
    }

    const { token } = await fetch(APIEndpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(res.statusText)
        }
      })
      .catch(e => {
        return { token: null }
      })
    if (token === null) {
      pushNotification(NotificationType.ERROR, 'Error', 'Invalid email or password', 2000)
      return
    }
    setToken(token)
    push('/')
    pushNotification(NotificationType.SUCCESS, 'Authentication successful', 'Welcome back to Conligo', 2500)
  }, [email, password])

  return (
    <div className={c(styles.loginForm, className)}>
      <FormInput
        ref={refEmail}
        label="email"
        value={email}
        required
        pattern={RegexPatterns.email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        className={styles.input}
      />
      <FormInput
        ref={refPassword}
        label="password"
        value={password}
        minLength={8}
        required
        onChange={e => setPassword(e.target.value)}
        type="password"
        className={styles.input}
      />

      <Button className={styles.right} onClick={handleLogIn}>
        Log in
      </Button>
      <div className="clearfix"></div>

      <p className={styles.footerText}>
        Don’t have an account yet?{' '}
        <A href="#" onClick={() => onModeSwitch()}>
          Sign up now.
        </A>
      </p>
    </div>
  )
}

interface SignUpFormProps {
  className?: string
  onModeSwitch: () => void
}

const SignUpForm: React.FunctionComponent<SignUpFormProps> = ({ className, onModeSwitch }: SignUpFormProps) => {
  const { pushNotification } = useNotifications()
  const { setToken } = useAuth()
  const { push } = useHistory()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [matNumber, setMatNumber] = useState('')
  const [password, setPassword] = useState('')

  const refEmail = useRef<HTMLInputElement>(null)
  const refName = useRef<HTMLInputElement>(null)
  const refUniversity = useRef<HTMLInputElement>(null)
  const refMatNumber = useRef<HTMLInputElement>(null)
  const refPassword = useRef<HTMLInputElement>(null)

  const handleSignUp = useCallback(async () => {
    if (!refName.current?.validity.valid) {
      pushNotification(NotificationType.WARNING, 'Uh-oh!', 'Given name is invalid', 2000)
      return
    }

    if (!refEmail.current?.validity.valid) {
      pushNotification(NotificationType.WARNING, 'Uh-oh!', 'Given email is invalid', 2000)
      return
    }

    if (!refUniversity.current?.validity.valid) {
      pushNotification(NotificationType.WARNING, 'Uh-oh!', 'Given university name is too short', 2000)
      return
    }
    if (!refMatNumber.current?.validity.valid) {
      pushNotification(NotificationType.WARNING, 'Uh-oh!', 'Given matriculation number is invalid', 2000)
      return
    }
    if (!refPassword.current?.validity.valid) {
      pushNotification(NotificationType.WARNING, 'Uh-oh!', 'Given password is too short', 2000)
      return
    }

    const { token } = await fetch(APIEndpoints.signup, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName: name, university, matNumber, email, password })
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(res.statusText)
        }
      })
      .catch(e => {
        return { token: null }
      })
    if (token === null) {
      pushNotification(NotificationType.ERROR, 'Error', 'Sign up failed, email is likely taken', 2000)
      return
    }
    setToken(token)
    push('/')
    pushNotification(NotificationType.SUCCESS, 'Account created', 'Welcome to Conligo', 2500)
  }, [email, password, university, matNumber, name])
  return (
    <div className={c(styles.signUpForm, className)}>
      <FormInput
        ref={refName}
        label="full name"
        value={name}
        pattern={RegexPatterns.fullName}
        onChange={e => setName(e.target.value)}
        required
        type="text"
        className={styles.input}
      />
      <FormInput
        ref={refEmail}
        label="email"
        value={email}
        pattern={RegexPatterns.email}
        onChange={e => setEmail(e.target.value)}
        required
        type="text"
        className={styles.input}
      />
      <FormInput
        ref={refUniversity}
        label="university"
        value={university}
        pattern={RegexPatterns.atleast3}
        onChange={e => setUniversity(e.target.value)}
        required
        type="text"
        className={styles.input}
      />
      <FormInput
        ref={refMatNumber}
        label="matriculation number"
        value={matNumber}
        pattern={RegexPatterns.atleast3}
        onChange={e => setMatNumber(e.target.value)}
        required
        type="text"
        className={styles.input}
      />
      <FormInput
        ref={refPassword}
        label="password"
        value={password}
        minLength={8}
        onChange={e => setPassword(e.target.value)}
        required
        type="password"
        className={styles.input}
      />

      <Button className={styles.right} onClick={handleSignUp}>
        Sign up
      </Button>
      <div className="clearfix"></div>

      <p className={styles.footerText}>
        Already have an account?{' '}
        <A href="#" onClick={() => onModeSwitch()}>
          Log in now.
        </A>
      </p>
    </div>
  )
}
