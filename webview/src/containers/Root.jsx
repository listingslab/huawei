/**
 * Created by Chris Dorward on 16/01/2017
 * container/Root
 */

import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import routes from '../routes';

const Root = ({ history }) => (
      <Router history={history} routes={routes} />
);

Root.propTypes = {
  history: PropTypes.object.isRequired
};

export default Root;
