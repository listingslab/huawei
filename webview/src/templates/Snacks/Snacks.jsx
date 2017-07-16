/* global editor */
/* global cms */
/**
 * Created by Chris Dorward on 31/01/2017
 * templates/Snacks/Snacks
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import Slider from 'react-slick';
import './Snacks.scss';


class Snacks extends Component {
  static propTypes = {
    input: PropTypes.string
  }

  componentDidMount() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  makeMarkup() {
    console.log(cms.app.data);
    return { __html: cms.app.data.about.post.post_content };
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div className="container text-center">
        <Slider {...settings}>
          <div className="slider-pane"><h3>1</h3></div>
          <div className="slider-pane"><h3>2</h3></div>
          <div className="slider-pane"><h3>3</h3></div>
          <div className="slider-pane"><h3>4</h3></div>
          <div className="slider-pane"><h3>5</h3></div>
          <div className="slider-pane"><h3>6</h3></div>
        </Slider>
      </div>
    );
  }
}

export default Snacks;
