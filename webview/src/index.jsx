/**
 * Created by Chris Dorward on 16/01/2017
 * index.js Application entrypoint
 */

import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import ReactGA from 'react-ga';
import 'bootstrap/dist/css/bootstrap.css';
import Root from './containers/Root';

ReactGA.initialize('UA-91375404-1');

render(
  <Root history={browserHistory} />,
  document.getElementById('root')
);
