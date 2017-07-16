/* global editor */
/**
 * Created by Chris Dorward on 23/01/2017
 * components/Hero/Hero
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import EditLink from '../../components/EditLink/EditLink';

import './Hero.scss';

function Hero(props) {
  const className = `hero jumbotron hero-${props.colour}`;
  const classNameBtn = `btn btn-default hero-btn hero-btn-${props.colour}`;
  let editBtn = null;
  if (editor) {
    editBtn = (<EditLink
      editUrl={props.editUrl || ''}
    />);
  }
  return (
    <div className={className}>
    {editBtn}
    <h2>{ props.title || 'Default Hero Header'}</h2>
    <p>{ props.subTitle || 'Default short description' }</p>
      <Link
        className={classNameBtn}
        to={props.linkUrl || '/'}
        role="button"
      ><span className="glyphicon glyphicon-star" />&nbsp;{ props.linkText || 'Click me' }
      </Link>
    </div>
  );
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  // linkType: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  showEdit: PropTypes.bool.isRequired,
  editUrl: PropTypes.string
};

export default Hero;

/*

  to={{
    pathname: '/item',
    query: {
      itemID: '123'
    }
  }}

  <Link
    className="btn btn-default btn-lg"
    to={props.url || defaults.url}
    role="button">
    {props.linkText || defaults.linkText}
  </Link>
*/
