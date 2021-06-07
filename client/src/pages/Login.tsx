import styles from '@/styles/pages/login.module.scss'
import React, { useState } from 'react'
import c from 'classnames'

import LOGO_SVG from 'assets/logo.svg'
import { Input } from '@/components/input'
import { FormInput } from '@/components/formInput'
import { Button } from '@/components/button'
import { A } from '@/components/a'
import { RegexPatterns } from '@/regex'

export interface LoginProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Login: React.FunctionComponent<LoginProps> = ({ className, onClick }: LoginProps) => {
  const [mode, setMode] = useState<'login' | 'singup'>('login')
  return (
    <div className={c(styles.login, className)} onClick={onClick}>
      <div className={styles.form}>
        <div className={styles.header}>
          <img className={styles.logoImg} src={LOGO_SVG} />
          <div className={styles.logoText}>
            <p className={styles.name}>Conligo</p>
            <p className={styles.moto}>Connect with your fellow students</p>
          </div>
          <div className="clearfix"></div>
        </div>
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={c(styles.loginForm, className)}>
      <FormInput
        label="email"
        value={email}
        pattern={RegexPatterns.email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        className={styles.input}
      />
      <FormInput
        label="password"
        value={password}
        minLength={8}
        onChange={e => setPassword(e.target.value)}
        type="password"
        className={styles.input}
      />

      <Button className={styles.right}>Log in</Button>
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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [matNumber, setMatNumber] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={c(styles.signUpForm, className)}>
      <FormInput
        label="full name"
        value={name}
        pattern={RegexPatterns.fullName}
        onChange={e => setName(e.target.value)}
        type="text"
        className={styles.input}
      />
      <FormInput
        label="email"
        value={email}
        pattern={RegexPatterns.email}
        onChange={e => setEmail(e.target.value)}
        type="text"
        className={styles.input}
      />
      <FormInput
        label="university"
        value={university}
        pattern={RegexPatterns.atleast3}
        onChange={e => setUniversity(e.target.value)}
        type="text"
        className={styles.input}
      />
      <FormInput
        label="matriculation number"
        value={matNumber}
        pattern={RegexPatterns.atleast3}
        onChange={e => setMatNumber(e.target.value)}
        type="text"
        className={styles.input}
      />
      <FormInput
        label="password"
        value={password}
        minLength={8}
        onChange={e => setPassword(e.target.value)}
        type="password"
        className={styles.input}
      />

      <Button className={styles.right}>Sign up</Button>
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