/**
 * Created by Chris Dorward on 31/01/2017
 * components/Breadcrumb/Breadcrumb
 */

import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';

import './Breadcrumb.scss';

function Breadcrumb(props) {
  const routePath = props.route.path.split('/');
  let parentPage = null;
  if (routePath.length > 2) {
    let parentPath = null;
    let parentTitle = null;
    if (routePath[1] === 'tip') {
      parentPath = '/tips';
      parentTitle = 'Tips';
    }
    if (routePath[1] === 'recipe' || routePath[1] === 'recipes') {
      parentPath = '/recipes';
      parentTitle = 'Recipes & Ideas';
    }
    parentPage = (
      <span>&nbsp;&nbsp;&gt;&nbsp;&nbsp;
        <Link className=""
          to={parentPath}
          title="Home"
      >{parentTitle}</Link>
      </span>);
  }
  return (
    <div id="hlbBreadcrumb" className="hlb-breadcrumb container">

        <Link className=""
          to={'/'}
          title="Home"
      ><span className="glyphicon glyphicon-home" /></Link>

      <span>&nbsp;&nbsp;&gt;&nbsp;&nbsp;

          <Link
            className=""
            to={''}
            onClick={browserHistory.goBack}
            title="Back"
          >Back</Link></span>

        {parentPage}

      <span>&nbsp;&nbsp;&gt;&nbsp;&nbsp;
          <span className="breadcrumb-this-page">{props.thisTitle || ''}</span>
      </span>
    </div>
  );
}

Breadcrumb.propTypes = {
  thisTitle: PropTypes.string
};

export default Breadcrumb;
