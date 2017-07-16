/* global editor */
/**
 * Created by Chris Dorward on 31/01/2017
 * components/CardCategory/CardCategory
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './CardCategory.scss';

function CardCategory(props) {
  // console.log(props.acf.image.sizes.medium);
  const image = props.image || '/img/defaults/CardCategory.jpg';
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
        <div className="recipe-center-overlay">{props.numberItems} {props.countText}</div>
      </Link>
    </div>
  );
}

CardCategory.propTypes = {
  route: PropTypes.string.isRequired,
  numberItems: PropTypes.number.isRequired,
  // itemType: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  countText: PropTypes.string,
  subTitle: PropTypes.string.isRequired
};

export default CardCategory;
