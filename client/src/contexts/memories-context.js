import React, { createContext, useContext } from 'react';
import { useMemories } from '../hooks/useMemories';

export const MemoriesContext = createContext();

export const MemoriesContextProvider = ({ children }) => {
  const { memories, setMemories } = useMemories();

  return (
    <MemoriesContext.Provider value={ { memories, setMemories } }>
      { children }
    </MemoriesContext.Provider>
  )
}

export const useMemoriesValue = () => useContext(MemoriesContext);
