import React, { useState, createContext, useContext } from 'react';

export const FilterContext = createContext();

export const FilterContextProvider = ({ children }) => {
    const [ openFilter, setOpenFilter ] = useState(false);
    const [ filterCriteria, setFilterCriteria ] = useState(new Map());

    return (
        <FilterContext.Provider value={ {
            openFilter,
            setOpenFilter,
            filterCriteria,
            setFilterCriteria
        }} >
            { children}
        </FilterContext.Provider>
    )
}

export const useFilterValue = () => useContext(FilterContext);
