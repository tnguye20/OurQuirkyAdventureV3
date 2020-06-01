import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const { authUser, setAuthUser } = useAuth();

  return (
    <AuthContext.Provider value={ { authUser, setAuthUser } }>
      { children }
    </AuthContext.Provider>
  )
}

export const useAuthValue = () => useContext(AuthContext);
