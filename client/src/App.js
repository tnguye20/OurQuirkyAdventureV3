import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { AuthProvider, MemoriesContextProvider } from './contexts';
import * as ROUTES from './constants/routes';

import { OQA } from './components/OQA';
import { Upload } from './components/Upload';
import { Login } from './components/Login/';
import { Signup } from './components/Signup/';
import { Signout } from './components/Signout/';
import { AuthRoute, UnAuthRoute } from './components/AuthRoute/';
import { Header } from './components/Header';


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

          <AuthRoute path="/upload">
            <Header />
            <Upload />
          </AuthRoute>

          <AuthRoute exact path="/">
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
