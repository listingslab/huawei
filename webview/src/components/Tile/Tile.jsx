/* global editor */
/**
 * Created by Chris Dorward on 15/01/2017
 * components/Tile/Tile
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './Tile.scss';

function Tile(props) {
  const className = `well tile tile-${props.itemType}`;
  const classNameBtn = `btn btn-default tile-title-btn tile-title-btn-${props.itemType}`;
  let editBtn = null;
  if (editor) {
    editBtn = (<div className="pull-right"><Link className="btn btn-link edit-btn"
      href={props.editUrl || ''}
      role="button"
    ><span className="glyphicon glyphicon-pencil" />&nbsp;Edit</Link></div>
    );
  }
  return (
    <div className="col-md-6">
      <div className={className}>
        <Link
          className={classNameBtn}
          to={props.route}
          role="button"
        ><span className="glyphicon glyphicon-hand-right" />&nbsp;&nbsp;{props.title || ''}</Link>
        {editBtn}
        <div className="tile-sub-title">
          <p>{props.subTitle || ''}</p>
        </div>
      </div>
    </div>
  );
}
// tileTypes
Tile.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  editUrl: PropTypes.string,
  itemType: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired
  // itemModified: PropTypes.string.isRequired
};

export default Tile;

/*
<p><small>Modified <strong>{props.itemModified || 'A long time ago'}</strong></small></p>
*/
