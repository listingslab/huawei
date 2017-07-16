/* global cms */
/* global editor */
/**
 * Created by Chris Dorward on 12/02/2017
 * components/YourTip/YourTip
 */

import React, { PropTypes } from 'react';

function YourTip(props) {
  // console.log(props);
  const title = props.tipData.post.post_title;
  const tipMarkup = { __html: props.tipData.acf.further_information };
  return (
    <div className="your-tip row-eq-height col-md-6">
      <div className="your-tip-text-content">
        <img
          alt={title}
          src={props.icon}
        />
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={tipMarkup} />
      </div>
    </div>
  );
}

YourTip.propTypes = {
  tipData: PropTypes.any.isRequired,
  icon: PropTypes.string.isRequired
};

export default YourTip;
