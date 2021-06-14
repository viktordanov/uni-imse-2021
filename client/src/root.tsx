import React from 'react'
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { Notifier } from './components/notifier/notifier'
import { NotifyProvider } from './context/notifierContext'
import { useAuth } from './hooks/useAuth'
import { Admin } from './pages/Admin'
import { Debug } from './pages/Debug'
import { Login } from './pages/Login'
import { StudentPanel } from './pages/StudentPanel'

export const Root: React.FunctionComponent = () => {
  return (
    <>
      <NotifyProvider>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/debug">
              <Debug />
            </Route>
            <PrivateRoute exact path="/admin">
              <Admin />
            </PrivateRoute>
            <PrivateRoute path="/">
              <StudentPanel />
            </PrivateRoute>
          </Switch>
        </Router>
        <Notifier />
      </NotifyProvider>
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
