/* global editor */
/**
 * Created by Chris Dorward on 31/01/2017
 * components/CardRecipeItem/CardRecipeItem
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './CardRecipeItem.scss';


function CardRecipeItem(props) {
  const tabText = props.tabText.toUpperCase();
  const image = props.image || '/img/defaults/RecipeImage.jpg';
  const freezableIcon = '/img/icons/icon-freezeable.png';

  let iconTab = null;
  if (props.freezable) {
    iconTab = (
      <p><span>
      <img
        alt={props.title || ''}
        className="card-recipe-item-icon"
        src={freezableIcon}
      /> {tabText || ''}</span></p>
    );
  }

  return (
    <div className="card-recipe-item">
      <Link
        to={props.route}
      >
        <div className="card-recipe-item-tab-text ">
          <img
            alt={props.title || ''}
            className="card-recipe-img img-responsive"
            src={image}
          />
          {iconTab}
        </div>
        <div className="card-recipe-item-detail">
          <h4>{props.title || ''}</h4>
          <p>
            Prep time <strong>{props.preparation_time || '0'} mins</strong>
          &nbsp;
          Cook time <strong>{ props.cooking_time || '0'} mins</strong>
          </p>
        </div>

      </Link>
    </div>
  );
}

CardRecipeItem.propTypes = {
  route: PropTypes.string.isRequired,
  tabText: PropTypes.string.isRequired,
  cooking_time: PropTypes.string.isRequired,
  preparation_time: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  freezable: PropTypes.bool
};

export default CardRecipeItem;
