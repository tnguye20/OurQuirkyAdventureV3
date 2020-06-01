import React from 'react';
import { useMemoriesValue } from '../../contexts';
import AwesomeSlider from 'react-awesome-slider';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import AnimationStyles from 'react-awesome-slider/src/styled/fold-out-animation/fold-out-animation.scss';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/fall-animation';
import './OQA.css';

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
        interval={9000}
        animation="fallAnimation"
        cssModule={[CoreStyles, AnimationStyles, AwesomeSliderStyles]}
      >
        { memories.map( (memory, index) => (
          <div key={index} data-src={memory.url}>
            <p className="slideCaption">{ memory.title }</p>
          </div>
        ) ) }
      </AutoplaySlider>
    ) : <h1>Please</h1>
  )
}
