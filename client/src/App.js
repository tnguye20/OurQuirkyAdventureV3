import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { AuthProvider, MemoriesContextProvider, UserContextProvider, FilterContextProvider } from './contexts';
import * as ROUTES from './constants/routes';

import { OQA } from './components/OQA';
// import { GridMode } from './components/GridMode';
import { GridMode } from './components/GridMode-Infinite';
import { Upload } from './components/Upload';
import { Login } from './components/Login/';
import { Signup } from './components/Signup/';
import { Signout } from './components/Signout/';
import { AuthRoute, UnAuthRoute, StaticRoute } from './components/AuthRoute/';
import { Header } from './components/Header';
import { UserSettings } from './components/UserSettings';

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
                  <FilterContextProvider>
                    <Header />
                    <GridMode />
                  </FilterContextProvider>
                </UserContextProvider>
              </MemoriesContextProvider>
            </AuthRoute>

            <AuthRoute path={ ROUTES.UPLOAD }>
              <UserContextProvider>
                <FilterContextProvider>
                  <Header />
                  <Upload />
                </FilterContextProvider>
              </UserContextProvider>
            </AuthRoute>

            <AuthRoute path={ ROUTES.USER_SETTINGS }>
              <MemoriesContextProvider>
                <UserContextProvider>
                  <FilterContextProvider>
                    <Header />
                    <UserSettings />
                  </FilterContextProvider>
                </UserContextProvider>
              </MemoriesContextProvider>
            </AuthRoute>

            <AuthRoute path={ ROUTES.SLIDE }>
              <MemoriesContextProvider>
                <UserContextProvider>
                  <FilterContextProvider>
                    <Header />
                    <OQA />
                  </FilterContextProvider>
                </UserContextProvider>
              </MemoriesContextProvider>
            </AuthRoute>

            <StaticRoute path={ ROUTES.ROOT }>
              <Landing />
            </StaticRoute>

          </Switch>
        </Router>
    </AuthProvider>
  );
}
