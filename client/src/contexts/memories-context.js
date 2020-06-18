import React, { createContext, useContext } from 'react';
import { useMemories } from '../hooks/useMemories';

export const MemoriesContext = createContext();

export const MemoriesContextProvider = ({ children }) => {
  const { 
    memories,
    cities,
    states,
    takenMonths,
    takenYears,
    setMemories,
    filterBy,
    setFilterBy
  } = useMemories();

  return (
    <MemoriesContext.Provider value={ { memories, cities, takenMonths, states, takenYears, setMemories, filterBy, setFilterBy } }>
      { children }
    </MemoriesContext.Provider>
  )
}

export const useMemoriesValue = () => useContext(MemoriesContext);
