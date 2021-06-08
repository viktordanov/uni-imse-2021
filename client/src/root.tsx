import React from 'react'
import styles from './styles/root.module.scss'
import c from 'classnames'
import { useAuth } from './hooks/useAuth'
import { BrowserRouter as Router, Link, Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { Login } from './pages/Login'
import { Debug } from './pages/Debug'

export interface RootProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Root: React.FunctionComponent<RootProps> = ({ className, onClick }: RootProps) => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/debug">
            <Debug />
          </Route>
          <PrivateRoute path="/users"></PrivateRoute>
          <PrivateRoute path="/"></PrivateRoute>
        </Switch>
      </Router>
    </>
  )
}
export const PrivateRoute: React.FunctionComponent<RouteProps> = ({ children, ...rest }: RouteProps) => {
  const { isAuthenticated } = useAuth()
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}
