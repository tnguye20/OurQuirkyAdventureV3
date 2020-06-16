import React, { createContext, useContext } from 'react';
import { useUser } from '../hooks/useUser';

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
  const { user, setUser } = useUser();

  return (
    <UserContext.Provider value={ { user, setUser } }>
      { children }
    </UserContext.Provider>
  )
}

export const useUserValue = () => useContext(UserContext);
