import React, { useEffect } from 'react';
import { useMemoriesValue, useFilterValue } from '../../contexts';

import './OQA.css';

import { NoSlide } from '../NoSlide';
import { Filter } from '../Filter';
import { Slider } from '../SliderManual';
// import { Slider } from '../Slider';

export const OQA = () => {
  const { memories } = useMemoriesValue();
  const { openFilter, setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();

  useEffect(() => {
    console.log("Normal Load");
    console.log('filterCriteria.size', filterCriteria.size);
    // if(filterCriteria.size > 0){
      console.log("We Hit Next Manually");
      const nextBtn = document.querySelector(".awssld__next");
      if (nextBtn !== null) nextBtn.click();
    // }
  }, [filterCriteria]);

  return (
    memories.length !== 0
    ? (
      <>
        <Filter open={openFilter} handleClose={ e => setOpenFilter(false) } filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria}/>
        <Slider memories={memories} filterCriteria={filterCriteria} setOpenFilter={setOpenFilter} setFilterCriteria={setFilterCriteria}/>
      </>
    ) : ( <NoSlide /> )
  )
}
