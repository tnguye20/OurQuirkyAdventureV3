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

import { memFilter } from '../../utils';

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

  const filtered =  memFilter(memories, filterCriteria);

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
