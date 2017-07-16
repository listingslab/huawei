/* global cms */
/* global editor */
/**
 * Created by Chris Dorward on 11/02/2017
 * components/CardFooditem/CardFooditem
 */

import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';

function CardFooditem(props) {
  // const editUrl = `http://api.healthylunchbox.com.au/wp-admin/post.php?post=${props.itemData.post.ID}&action=edit`;
  let className = 'builder-2-card';
  if (cms.builder.cereals !== 0) {
    if (cms.builder.cereals.ID === props.itemData.post.ID) {
      className = 'builder-2-card builder-2-card-selected';
    }
  }
  if (cms.builder.salad !== 0) {
    if (cms.builder.salad.ID === props.itemData.post.ID) {
      className = 'builder-2-card builder-2-card-selected';
    }
  }
  if (cms.builder.meat !== 0) {
    if (cms.builder.meat.ID === props.itemData.post.ID) {
      className = 'builder-2-card builder-2-card-selected';
    }
  }
  if (cms.builder.dairy !== 0) {
    if (cms.builder.dairy.ID === props.itemData.post.ID) {
      className = 'builder-2-card builder-2-card-selected';
    }
  }
  if (cms.builder.fruit !== 0) {
    if (cms.builder.fruit.ID === props.itemData.post.ID) {
      className = 'builder-2-card builder-2-card-selected';
    }
  }
  if (cms.builder.water !== 0) {
    if (cms.builder.water.ID === props.itemData.post.ID) {
      className = 'builder-2-card builder-2-card-selected';
    }
  }

  const itemClicked = () => {
    if (props.foodgroup === 'fruit') {
      cms.builder.fruit = props.itemData;
    }
    if (props.foodgroup === 'dairy') {
      cms.builder.dairy = props.itemData;
    }
    if (props.foodgroup === 'meat-alternatives') {
      cms.builder.meat = props.itemData;
    }
    if (props.foodgroup === 'vegetables-salads') {
      cms.builder.salad = props.itemData;
    }
    if (props.foodgroup === 'water') {
      cms.builder.water = props.itemData;
    }
    if (props.foodgroup === 'breads-cereals') {
      cms.builder.cereals = props.itemData;
    }
    browserHistory.push('/healthy-lunch-box');
  };

  return (
    <div
      onClick={() => itemClicked()}
      className="col-lg-4 col-md-4 col-sm-4 col-xs-6"
    >
      <div className={className}>
        <img
          alt={props.itemData.post.post_title || ''}
          src={props.itemData.acf.image || '/img/builder/green-carrot.png'}
          className="img-responsive builder-screen-2-card-img"
        />
        <div className="builder-2-card-text">
          <h4>{props.itemData.post.post_title || ''}</h4>
          <p>{props.itemData.acf.card_sub_text || ''}</p>
        </div>
      </div>
    </div>
  );
}

CardFooditem.propTypes = {
  itemData: PropTypes.any.isRequired,
  foodgroup: PropTypes.string.isRequired
};

export default CardFooditem;
