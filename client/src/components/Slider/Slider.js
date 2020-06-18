import React, { useState } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import withAutoplay from 'react-awesome-slider/dist/autoplay';

import FoldStyles from 'react-awesome-slider/src/styled/fold-out-animation';
import FallStyles from 'react-awesome-slider/src/styled/fall-animation';
import OpenStyles from 'react-awesome-slider/src/styled/open-animation';
import CubeStyles from 'react-awesome-slider/src/styled/cube-animation';
import ScaleOutStyles from 'react-awesome-slider/src/styled/scale-out-animation';

import './Slider.css';

import { NoSlide } from '../NoSlide';

import moment from 'moment';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const ANIMATION_LIST = [
  "fallAnimation",
  "foldOutAnimation",
  "openAnimation",
  "cubeAnimation",
  "scaleOutAnimation",
]

export const Slider = ({
  memories,
  filterCriteria,
  setOpenFilter,
  setFilterCriteria,
}) => {
  const [ transition, setTransition ] = useState(ANIMATION_LIST[0]);

  const isUnion = ( arr1, arr2 ) => {
    const base = arr1.length >= arr2.length ? arr1 : arr2;
    const target = arr1.length >= arr2.length ? arr2 : arr1;
    const baseMap = new Map();
    base.forEach( item => baseMap.set(item, 0));
    let result = false;
    for ( let i = 0; i < target.length; i++ ){
      if(baseMap.has(target[i])){
        result = true;
        break;
      }
    }
    return result;
  }

  const filtered = memories.filter( memory => {
    if( filterCriteria.size === 0 ) return true;
    // console.log(filterCriteria, memory.state);
    const included = Array.from(filterCriteria.keys()).reduce( (included, key) => {
      if ( memory[key] !== undefined ){
        if ( key === "tags" ) return included && isUnion(filterCriteria.get(key), memory.tags);
        return included && filterCriteria.get(key).indexOf(memory[key]) !== -1;
      }
      return false;
    }, true);
    // console.log(included);
    return included;
  });

  if(filtered.length === 0){
    return ( <NoSlide /> );
  }

  return (
    <AutoplaySlider
    onTransitionEnd={ slider => {
      const randomIndex = Math.floor(Math.random() * ANIMATION_LIST.length);
      setTransition( ANIMATION_LIST[randomIndex] );
    }}
    bullets={false}
    organicArrows={false}
    fillParent={true}
    play={true}
    cancelOnInteraction={false}
    interval={5000}
    animation={transition}
    cssModule={[CoreStyles, FoldStyles, FallStyles, OpenStyles, CubeStyles, ScaleOutStyles]}
    >
    { filtered.map( (memory, index) => (
        <div key={index} data-src={memory.url}>
        <div className="slideCaption">
        <b>{ memory.title }</b>
        {
          memory.latitude !== undefined ? (
            <div className="slideMeta">
            { memory.takenDate ? (
              <p>{ moment.utc(memory.takenDate).format('MMMM Do YYYY, h:mm:ss a') }</p>
            ): "" }
            <p>{ `${memory.neighbourhood} ${memory.streetName}, ${memory.city}, ${memory.state}` }</p>
            </div>
          ) : ""
        }
        </div>
        </div>
      ) ) }
    </AutoplaySlider>
  )
}
