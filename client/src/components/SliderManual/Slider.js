import React, { useState, useEffect, useRef } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
// import withAutoplay from 'react-awesome-slider/dist/autoplay';

import FoldStyles from 'react-awesome-slider/src/styled/fold-out-animation';
import FallStyles from 'react-awesome-slider/src/styled/fall-animation';
import OpenStyles from 'react-awesome-slider/src/styled/open-animation';
import CubeStyles from 'react-awesome-slider/src/styled/cube-animation';
import ScaleOutStyles from 'react-awesome-slider/src/styled/scale-out-animation';

import './Slider.css';

import { NoSlide } from '../NoSlide';

import moment from 'moment';

import { memFilter } from '../../utils';

// const AutoplaySlider = withAutoplay(AwesomeSlider);

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

  const sliderRef = useRef(null);
  const [ transition, setTransition ] = useState(ANIMATION_LIST[0]);
  const [ lastTimeOutID, setLastTimeOutID ] = useState(null);

  const iOS = () => {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  const sliderEffect = (_slider) => {
    let currentSlide = sliderRef.current;
    let isVideo = false;
    let video = null;

    if(_slider){
      console.log(_slider);
      isVideo = _slider.nextSlide.children[0].innerHTML.indexOf("video") === -1 ? false : true;
      video = _slider.nextSlide.childNodes[0].firstElementChild;
    } else {
      isVideo = currentSlide.slider.childNodes[0].childNodes[0].childNodes[0].innerHTML.indexOf("video") === -1 ? false : true;
      video = currentSlide.slider.childNodes[0].childNodes[0].childNodes[0].childNodes[0].firstElementChild;
    }
    console.log("isVideo", isVideo);
    let timeout = null;
    if (isVideo){
      video.controls = false;
      video.playsinline = true;
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      video.autoPlay = true;
      video.preload = "metadata";
      video.loop = false;
      video.onended = () => {
        console.log("Video Manual Push");
        currentSlide.clickNext();
      }
      video.onplay = () => {
        video.muted = true;
      }
      video.play().then( () => {
      }).catch( error => {
        console.log(error);
        if (error.name === "NotAllowedError"){
          console.log("Device reuqires users to press play");
          console.log("Video Manual Push");
          currentSlide.clickNext();
        }
      });
    } else {
      timeout = setTimeout( () => {
        console.log("Image Manual Push");
        currentSlide.clickNext();
      }, 5000);
      setLastTimeOutID(timeout);
    }

    return () => { if(timeout !== null) { clearTimeout(timeout) }; if (video !== null) { video.pause(); } }
  }

  useEffect( () => {
    console.log("-- Slider Effect --");
    return sliderEffect();
  }, [] )

  const filtered =  memFilter(memories, filterCriteria);

  if(filtered.length === 0){
    return ( <NoSlide /> );
  }

  return (
    <AwesomeSlider
    ref={sliderRef}
    mobileTouch={true}
    onTransitionRequest={ () => {
      console.log("Transition Requested");
      console.log(lastTimeOutID);
      clearTimeout(lastTimeOutID);
    } }
    onTransitionStart={ slider => {
      console.log("Transition Starts");
      sliderEffect(slider);
    }}
    onTransitionEnd={ () => {
      const randomIndex = Math.floor(Math.random() * ANIMATION_LIST.length);
      console.log("Transition Ends");
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
    </AwesomeSlider>
  )
}
