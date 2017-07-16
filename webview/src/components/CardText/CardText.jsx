/* global editor */
/* global cms */
/**
 * Created by Chris Dorward on 31/01/2017
 * components/CardText/CardText
 */

import React, { PropTypes } from 'react';
import './CardText.scss';

function CardText(props) {
  let title = '';
  let text = '';
  if (props.cardData.post_type === 'packed_lunch') {
    title = cms.app.data.special.data.packed_lunch_card_title || '';
    text = props.cardData.acf.whats_inside_list || '';
  }
  if (props.cardData.post_type === 'idea') {
    title = props.cardData.post_title || '';
    text = props.cardData.acf.idea || '';
  }
  const textMarkup = { __html: text };
  return (
    <div className="card-img-text-item">
      <img
        className="card-img-text-img img-responsive"
        alt={title}
        src={props.cardData.acf.image.url || '/img/defaults/CardText.jpg'}
      />
      <div className="card-img-text-content">
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={textMarkup} />
      </div>
    </div>
  );
}

CardText.propTypes = {
  cardData: PropTypes.any.isRequired
};

export default CardText;
