import React, { createContext, useContext } from 'react';
import { useMemories } from '../hooks/useMemories';

export const MemoriesContext = createContext();

export const MemoriesContextProvider = ({ children }) => {
  const {
    memories,
    // cities,
    // states,
    // takenMonths,
    // takenYears,
    filterObject,
    setMemories,
    filterBy,
    setFilterBy
  } = useMemories();

  return (
    <MemoriesContext.Provider value={ { memories, filterObject,  setMemories, filterBy, setFilterBy } }>
      { children }
    </MemoriesContext.Provider>
  )
}

export const useMemoriesValue = () => useContext(MemoriesContext);
