import React from 'react';
import { useMemoriesValue } from '../../contexts';
import AwesomeSlider from 'react-awesome-slider';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import AnimationStyles from 'react-awesome-slider/src/styled/fold-out-animation/fold-out-animation.scss';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/fall-animation';
import './OQA.css';
import {
  Grid
} from '@material-ui/core';

import moment from 'moment';

const AutoplaySlider = withAutoplay(AwesomeSlider);

export const OQA = () => {
  const { memories } = useMemoriesValue();

  return (
    memories.length !== 0
    ? (
      <AutoplaySlider
        bullets={false}
        organicArrows={false}
        fillParent={true}
        play={true}
        cancelOnInteraction={false}
        interval={5000}
        animation="fallAnimation"
        cssModule={[CoreStyles, AnimationStyles, AwesomeSliderStyles]}
      >
        { memories.map( (memory, index) => (
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
