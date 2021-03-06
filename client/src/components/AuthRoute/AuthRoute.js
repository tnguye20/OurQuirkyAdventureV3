import React from 'react';
import { useAuthValue } from '../../contexts';
import { Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

export const AuthRoute = ({children, ...rest}) => {
  const { authUser } = useAuthValue();

  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          authUser !== null ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: ROUTES.LOGIN,
                state: { from: location }
              }}
            />
          )
        )
      }
    />
  )
}

export const UnAuthRoute = ({children, ...rest}) => {
  const { authUser } = useAuthValue();

  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          authUser === null ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: ROUTES.SLIDE,
                state: { from: location }
              }}
            />
          )
        )
      }
    />
  )
}

export const StaticRoute = ({children, ...rest}) => {
  return (
    <Route
      {...rest}
      render={ () => (
        children
      )}
    />
  )
}
