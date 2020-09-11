import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

import { Slider } from '../SliderManual/';

import * as ROUTES from '../../constants/routes';

export const Landing = () => {
    return (
      <>
		<header>
			<div className="logo-container">
        <img src={process.env.PUBLIC_URL + './logo.svg'} alt="logo" />
				<h4 className="logo">Our Quirky Adventure</h4>
			</div>
			<nav>
				<ul className="nav-links">
          <li>
            <Link className="nav-link" to={ ROUTES.LOGIN }>
              Features
            </Link>
          </li>
          <li>
            <Link className="nav-link" to={ ROUTES.SIGNUP }>
              Sign Up
            </Link>
          </li>
				</ul>
			</nav>
			<div className="cart">
				<ul className="nav-links">
          <li>
            <Link className="nav-link" to={ ROUTES.LOGIN }>
              Login
            </Link>
          </li>
				</ul>
			</div>
		</header>

		<main>
			<section className="presentation">
				<div className="introduction">
					<div className="intro-text">
						<h1>The slideshow app of the future</h1>
						<p>
              Relive your memories. One swipe at a time
						</p>
					</div>
					<div className="cta">
						<button className="cta-select">Demo</button>
            <button className="cta-add"><a rel="noopener noreferrer" target="_blank" href="https://github.com/tnguye20">Author</a></button>
					</div>
				</div>
				<div className="cover">
          {
            //<img src={process.env.PUBLIC_URL + "/matebook.png"} alt="slider" />
          }
          <Slider
            user={{interval: 5000, animation: "random"}}
            bullets={true}
            organicArrows={true}
            filtered={[
              {url: process.env.PUBLIC_URL + "/demo_1.jpg"},
              {url: process.env.PUBLIC_URL + "/demo_2.jpg"}
            ]}
            fillParent={false}
            caption={false}
          />
				</div>
			</section>

			<img className="big-circle" src={process.env.PUBLIC_URL + "/big-eclipse.svg"} alt="" />
			<img className="medium-circle" src={process.env.PUBLIC_URL + "/mid-eclipse.svg"} alt="" />
			<img className="small-circle" src={process.env.PUBLIC_URL + "/small-eclipse.svg"} alt="" />
		</main>
</>
    )
}
