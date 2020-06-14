import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { AuthProvider, MemoriesContextProvider } from './contexts';
import * as ROUTES from './constants/routes';

import { OQA } from './components/OQA';
import { GridMode } from './components/GridMode';
import { Upload } from './components/Upload';
import { Login } from './components/Login/';
import { Signup } from './components/Signup/';
import { Signout } from './components/Signout/';
import { AuthRoute, UnAuthRoute } from './components/AuthRoute/';
import { Header } from './components/Header';

import { Landing } from './components/Landing';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <UnAuthRoute path={ ROUTES.LOGIN }>
            <Login />
          </UnAuthRoute>

          <UnAuthRoute path={ ROUTES.SIGNUP }>
            <Signup />
          </UnAuthRoute>

          <AuthRoute path={ ROUTES.SIGNOUT }>
            <Signout />
          </AuthRoute>

          <AuthRoute path={ ROUTES.GRID }>
            <MemoriesContextProvider>
              <Header />
              <GridMode />
            </MemoriesContextProvider>
          </AuthRoute>

          <AuthRoute path={ ROUTES.UPLOAD }>
            <Header />
            <Upload />
          </AuthRoute>

          <AuthRoute path="/landing">
            <Landing />
          </AuthRoute>

          <AuthRoute exact path={ ROUTES.ROOT }>
            <MemoriesContextProvider>
              <Header />
              <OQA />
            </MemoriesContextProvider>
          </AuthRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}
