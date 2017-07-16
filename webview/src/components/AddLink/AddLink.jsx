/**
 * Created by Chris Dorward on 31/01/2017
 * components/AddLink/AddLink
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './AddLink.scss';

function AddLink(props) {
  // const text = props.text || 'default';
  return (
    <div className="edit-link pull-right">
        <Link className="btn btn-default add-btn"
          href={props.addUrl || ''}
          title={props.addTitle || 'Add'}
      ><span className="glyphicon glyphicon-plus" /></Link>
    </div>
  );
}

AddLink.propTypes = {
  addUrl: PropTypes.string.isRequired,
  addTitle: PropTypes.string
};

export default AddLink;
