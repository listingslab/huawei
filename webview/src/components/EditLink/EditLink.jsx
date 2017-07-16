/**
 * Created by Chris Dorward on 31/01/2017
 * components/EditLink/EditLink
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './EditLink.scss';

function EditLink(props) {
  // const text = props.text || 'default';
  return (
    <div className="text-center">
        <Link className="btn btn-default edit-btn"
          href={props.editUrl || ''}
          title="Edit content"
      ><span className="glyphicon glyphicon-pencil" /></Link>
    </div>
  );
}

EditLink.propTypes = {
  editUrl: PropTypes.string.isRequired
};

export default EditLink;
