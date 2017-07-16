/**
 * Created by Chris Dorward on 16/01/2017
 * templates/NotFound//NotFound
 */

import React, { Component } from 'react';
import $ from 'jquery';
import { Link, browserHistory } from 'react-router';

class NotFound extends Component {
  static propTypes = {
  }

  componentDidMount() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  render() {
    return (
      <div className="container raised-page margin-top-25 margin-bottom-25">
        <h2>Oops, there seems to be a problem with that page.</h2>
        <p>You may want to head back to the&nbsp;
        <Link
          to="/"
          >homepage</Link>. If you think something is broken, please
          contact us so we can fix it. Otherwise, why not browse our
        <Link
          to="/recipes"
          >lunch box recipes and ideas</Link> for some healthy inspiration.</p>
      </div>
    );
  }
}

export default NotFound;
