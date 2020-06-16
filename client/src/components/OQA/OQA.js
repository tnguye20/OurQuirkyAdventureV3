import React, { useState } from 'react';
import { useMemoriesValue } from '../../contexts';
import AwesomeSlider from 'react-awesome-slider';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import withAutoplay from 'react-awesome-slider/dist/autoplay';

import FoldStyles from 'react-awesome-slider/src/styled/fold-out-animation';
import FallStyles from 'react-awesome-slider/src/styled/fall-animation';
import OpenStyles from 'react-awesome-slider/src/styled/open-animation';
import CubeStyles from 'react-awesome-slider/src/styled/cube-animation';
import ScaleOutStyles from 'react-awesome-slider/src/styled/scale-out-animation';

import './OQA.css';
import {
  Grid
} from '@material-ui/core';

import moment from 'moment';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const ANIMATION_LIST = [
  "fallAnimation",
  "foldOutAnimation",
  "openAnimation",
  "cubeAnimation",
  "scaleOutAnimation",
]

export const OQA = () => {
  const { memories } = useMemoriesValue();
  const [ filter, setFilter ] = useState([]);
  const [ transition, setTransition ] = useState(ANIMATION_LIST[0]);

  return (
    memories.length !== 0
    ? (
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
        { memories
          .filter( memory => {
            if ( filter.length === 0){
              return true;
            } else {
              const { tags } = memory;
              for( let tag of tags){
                if( filter.indexOf(tag) !== -1 ){
                  return true;
                  break;
                }
              }
              return false;
            }
          })
          .map( (memory, index) => (
          <div key={index} data-src={memory.url}>
            <div className="slideCaption">
              <b>{ memory.title }</b>
              {/* <button onClick={ async () => { await setFilter(["girls", "Solids"]); document.querySelector(".awssld__next").click(); }}>girls Solids</button>
              <button onClick={ async () => { await setFilter(["Solids"]); document.querySelector(".awssld__next").click(); }}>Solids</button>
              <button onClick={ () => { setFilter([]) }}>Reset</button> */}
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
    ) : ( <NoSlide /> )
  )
}

const NoSlide = () => {
  return (
    <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh'}}
    >
      <Grid item xs={10} sm={6}>
        <img alt="Default for no slide" src={process.env.PUBLIC_URL + '/noSlide.gif'} />
        <p>Awww! There is nothing to show. Feel free to upload some memories ❤</p>
      </Grid>
    </Grid>
  )
}
