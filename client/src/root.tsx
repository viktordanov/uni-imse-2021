import React from 'react'
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Debug } from './pages/Debug'
import { Login } from './pages/Login'
import { StudentPanel } from './pages/StudentPanel'

export const Root: React.FunctionComponent = () => {
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

          <PrivateRoute path="/">
            <StudentPanel />
          </PrivateRoute>
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
