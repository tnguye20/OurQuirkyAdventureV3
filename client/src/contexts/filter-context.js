import React, { useState, createContext, useContext } from 'react';

export const FilterContext = createContext();

export const FilterContextProvider = ({ children }) => {
    const _map = new Map();
    try{
      let cache = JSON.parse(localStorage.getItem("filterCriteria"));
      if ( cache !== null && cache.length !== 0 ){
        cache.forEach( item => {
          const [ key, value ] = item;
          _map.set(key, value);
        } )
      }
    } catch (error) {
    }
    const [ openFilter, setOpenFilter ] = useState(false);
    const [ filterCriteria, setFilterCriteria ] = useState(_map);

    return (
        <FilterContext.Provider value={{
            openFilter,
            setOpenFilter,
            filterCriteria,
            setFilterCriteria
        }} >
            { children }
        </FilterContext.Provider>
    )
}

export const useFilterValue = () => useContext(FilterContext);
