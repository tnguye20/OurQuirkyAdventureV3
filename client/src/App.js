import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { AuthProvider, MemoriesContextProvider, UserContextProvider, FilterContextProvider } from './contexts';
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
                <UserContextProvider>
                  <Header />
                  <GridMode />
                </UserContextProvider>
              </MemoriesContextProvider>
            </AuthRoute>

            <AuthRoute path={ ROUTES.UPLOAD }>
              <UserContextProvider>
                  <Header />
                  <Upload />
              </UserContextProvider>
            </AuthRoute>

            <AuthRoute path="/landing">
              <Landing />
            </AuthRoute>

            <AuthRoute exact path={ ROUTES.SLIDE }>
              <MemoriesContextProvider>
                <UserContextProvider>
                  <FilterContextProvider>
                    <Header />
                    <OQA />
                  </FilterContextProvider>
                </UserContextProvider>
              </MemoriesContextProvider>
            </AuthRoute>

            <AuthRoute exact path={ ROUTES.ROOT }>
              <MemoriesContextProvider>
                <UserContextProvider>
                  <FilterContextProvider>
                    <Header />
                    <OQA />
                  </FilterContextProvider>
                </UserContextProvider>
              </MemoriesContextProvider>
            </AuthRoute>
          </Switch>
        </Router>
    </AuthProvider>
  );
}
