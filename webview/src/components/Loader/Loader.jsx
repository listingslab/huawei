/**
 * Created by Chris Dorward on 24/01/2017
 * components/Loader/Loader
 */

import React, { PropTypes } from 'react';
// import { Link } from 'react-router';

import './Loader.scss';

function Loader(props) {
  let logo = null;
  if (props.showLogo) {
    logo = (
      <img
        className="logo-graphic"
        src="/img/logos/HLB_logo-90.png"
        alt="HLB"
      />
    );
  }
  const text = props.text || 'default';
  return (
    <div className="loader container row text-center">
      {logo}
      <br />
      <div className="loader-text">
        <small><strong>{text}</strong></small>
      </div>
      <img
        height="75"
        className="loader-graphic"
        alt="loading"
        src="/img/loader.gif"
      />

    </div>
  );
}

Loader.propTypes = {
  text: PropTypes.string.isRequired,
  showLogo: PropTypes.bool.isRequired
};

export default Loader;

/*
*/
