import React, { useState, useEffect, useRef } from 'react';
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

  const sliderRef = useRef(null);
  const [ transition, setTransition ] = useState(ANIMATION_LIST[0]);
  const [ interval, setInterval ] = useState(5000);

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
    console.log(currentSlide);
    let isVideo = false;
    let video = null;

    if(_slider){
      isVideo = _slider.nextSlide.children[0].innerHTML.indexOf("video") === -1 ? false : true;
      video = _slider.nextSlide.childNodes[0].firstElementChild;
    } else {
      if(currentSlide.slider === undefined){
        isVideo = currentSlide.currentInfo.currentSlide.innerHTML.indexOf("video") === -1 ? false : true;
        video = currentSlide.currentInfo.currentSlide.firstChild.firstElementChild;
      } else {
        isVideo = currentSlide.slider.childNodes[0].childNodes[0].childNodes[0].innerHTML.indexOf("video") === -1 ? false : true;
        video = currentSlide.slider.childNodes[0].childNodes[0].childNodes[0].childNodes[0].firstElementChild;
      }
    }
    if (isVideo){
      video.controls = true;
      video.playsinline = true;
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      video.autoPlay = true;
      video.preload = "metadata";
      video.loop = false;
      video.onended = () => {
        // User sped up video using controls
        if( video.currentTime === video.duration  ){
          console.log("Video Manual Push");
          setInterval(5000);
          const nextBtn = document.querySelector(".awssld__next");
          if (nextBtn !== null) nextBtn.click();
        }
      }
      video.onloadedmetadata = () => {
        const duration = (video.duration) * 1000;
        console.log(video);
        console.log(duration);
        setInterval(duration);
      }
      video.onplay = () => {
        video.muted = true;
      }
      video.ontimeupdate = () => {
        // console.log("currentTime", video.currentTime);
      }
      video.play().then( () => {
      }).catch( error => {
        console.log(error);
        if (error.name === "NotAllowedError"){
          console.log("Device reuqires users to press play");
        }
      });
    } else {
      console.log("Not a video. Autoplay Resumes")
      if ( interval !== 5000 ){
        setInterval(5000);
      }
    }

  }

  useEffect( () => {
    console.log("-- Slider Effect --");
    return sliderEffect();
  }, [] );

  const filtered =  memFilter(memories, filterCriteria);

  if(filtered.length === 0){
    return ( <NoSlide /> );
  }

  return (
    <AutoplaySlider
    ref={sliderRef}
    onTransitionRequest={ () => {
      console.log("Transition Requested");
    } }
    onTransitionStart={ slider => {
      console.log("Transition Starts");
      sliderEffect(slider);
    }}
    onTransitionEnd={ () => {
      console.log("Transition Ends");
      const randomIndex = Math.floor(Math.random() * ANIMATION_LIST.length);
      setTransition( ANIMATION_LIST[randomIndex] );
    }}
    bullets={false}
    organicArrows={false}
    fillParent={true}
    play={true}
    cancelOnInteraction={false}
    interval={interval}
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
