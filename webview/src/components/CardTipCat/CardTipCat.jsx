/* global editor */
/**
 * Created by Chris Dorward on 04/02/2017
 * components/CardTipCat/CardTipCat
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './CardCategory.scss';

function CardTipCat(props) {
  // console.log(props.acf.image.sizes.medium);
  const image = props.image || '/img/defaults/CardCategory.jpg';
  // console.log(props);
  return (
    <div className="card-category">
      <Link
        to={props.route}
      >
        <img
          alt=""
          src={image}
          className="img-responsive card-category-image"
        />
      <div className={`card-color-overlay card-color-overlay-${props.colour}`} />
          <div className={`card-center-overlay-text card-color-overlay-text-${props.colour}`}>
          <h2>{props.title || ''}</h2>
          <p>{props.subTitle || ''}</p>
        </div>
      </Link>
    </div>
  );
}

CardTipCat.propTypes = {
  route: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  subTitle: PropTypes.string.isRequired
};

export default CardTipCat;
