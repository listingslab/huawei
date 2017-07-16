/**
 * Created by Chris Dorward on 16/01/2017
 * Routes
 */

import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Category from './templates/Category/Category';
import Lunchbox from './templates/HealthyLunchbox/Lunchbox';
import Foodgroup from './templates/HealthyLunchbox/Foodgroup';
import About from './templates/About/About';
import Home from './templates/Home/Home';
import Item from './templates/Item/Item';
import NotFound from './templates/NotFound//NotFound';
import Recipes from './templates/Recipes/Recipes';
import Tips from './templates/Tips/Tips';

const routes = (
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/healthy-lunch-box" component={Lunchbox} />
      <Route path="/healthy-lunch-box/:foodgroup" component={Foodgroup} />
      <Route path="/recipes" component={Recipes} />
      <Route path="/recipes/:slug" component={Category} />
      <Route path="/recipe/:slug" component={Item} />
      <Route path="/tips" component={Tips} />
      <Route path="/tips/:slug" component={Category} />
      <Route path="/tip/:slug" component={Item} />
      <Route path="/item" component={Item} />
      <Route path="/item/:slug" component={Item} />
      <Route path="/about" component={About} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default routes;
