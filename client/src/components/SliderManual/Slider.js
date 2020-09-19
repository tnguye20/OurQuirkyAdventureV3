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

const AutoplaySlider = withAutoplay(AwesomeSlider);

const ANIMATION_LIST = [
  "fallAnimation",
  "foldOutAnimation",
  "openAnimation",
  "cubeAnimation",
  "scaleOutAnimation",
]

export const Slider = ({
  filtered,
  user,
  fillParent=true,
  caption=true,
  organicArrows=false,
  bullets=false
}) => {
  const sliderRef = useRef(null);
  const [ transition, setTransition ] = useState(user.animation === undefined ? ANIMATION_LIST[0] : user.animation);
  const [ interval, setInterval ] = useState(user.interval);

  const sliderEffect = (_slider) => {
    let currentSlide = sliderRef.current;
    let isVideo = false;
    let video = null;

    if(_slider){
      isVideo = _slider.nextSlide.firstElementChild.innerHTML.indexOf("video") === -1 ? false : true;
      video = _slider.nextSlide.firstElementChild.firstElementChild.firstElementChild;
    } else {
      if(currentSlide.slider === undefined){
        isVideo = currentSlide.currentInfo.currentSlide.innerHTML.indexOf("video") === -1 ? false : true;
        video = currentSlide.currentInfo.currentSlide.firstChild.firstElementChild.firstElementChild;
      } else {
        isVideo = currentSlide.slider.childNodes[0].childNodes[0].childNodes[0].innerHTML.indexOf("video") === -1 ? false : true;
        video = currentSlide.slider.childNodes[0].childNodes[0].childNodes[0].childNodes[0].firstElementChild.firstElementChild;
      }
    }
    if (isVideo && video !== null){
      video.controls = true;
      video.playsinline = true;
      video.playsInline = true;
      video.autoplay = true;
      video.autoPlay = true;
      video.preload = "metadata";
      video.loop = false;
      video.muted = true;
      video.setAttribute("muted", "");

      video.onloadedmetadata = () => {
        const duration = (video.duration) * 1000;
        setInterval(duration);
        setTimeout( () => {
          video.play().then( () => {
          }).catch( error => {
            console.log(error);
            alert(error);
            if (error.name === "NotAllowedError"){
              console.log("Device reuqires users to press play");
            }
          });
        }, 0 );
      }

      video.onended = () => {
          // const nextBtn = document.querySelector(".awssld__next");
          // if (nextBtn !== null) {
          //   if ( iOS() ) {
          //     alert("WE HERE");
          //     sliderRef.current.currentInfo.currentSlide.dispatchEvent(new Event("ontransitionrequest"));
          //     sliderRef.current.currentInfo.currentSlide.dispatchEvent(new Event("transitionrequest"));
          //     sliderRef.current.currentInfo.currentSlide.dispatchEvent(new Event("transitionstart"));
          //     sliderRef.current.currentInfo.currentSlide.dispatchEvent(new Event("ontransitionstart"));
          //     nextBtn.dispatchEvent(new Event("touchend"));
          //     nextBtn.dispatchEvent(new Event("ontouchend"));
          //   }
          // }
        // User sped up video using controls
        if( video.currentTime === video.duration  ){
          console.log("Video Manual Push");
          setInterval(user.interval);
          const nextBtn = document.querySelector(".awssld__next");
          if (nextBtn !== null) nextBtn.click();
        }
      }
    } else {
      // console.log("Not a video. Autoplay Resumes")
      if ( interval !== user.interval ){
        setInterval(user.interval);
      }
    }

  }

  useEffect( () => {
    console.log("-- Slider Effect --");
    if (filtered.length > 0) return sliderEffect();
  }, [] );

  if(filtered.length === 0){
    return ( <NoSlide /> );
  }

  return (
    <AutoplaySlider
    ref={sliderRef}
    onTransitionRequest={ () => {
      // console.log("Transition Requested");
    } }
    onTransitionStart={ slider => {
      // console.log("Transition Starts");
      sliderEffect(slider);
    }}
    onTransitionEnd={ () => {
      // console.log("Transition Ends");
      if( user.animation === "random" ){
        const randomIndex = Math.floor(Math.random() * ANIMATION_LIST.length);
        setTransition( ANIMATION_LIST[randomIndex] );
      }
    }}
    bullets={bullets}
    organicArrows={organicArrows}
    fillParent={fillParent}
    play={true}
    cancelOnInteraction={false}
    interval={interval}
    animation={transition}
    cssModule={[CoreStyles, FoldStyles, FallStyles, OpenStyles, CubeStyles, ScaleOutStyles]}
    >
    { filtered.map( (memory, index) => (
        <div key={index} data-src={memory.url}>
          {
            caption === true ? (
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
            ) : ""
          }
        </div>
      ) ) }
    </AutoplaySlider>
  )
}
