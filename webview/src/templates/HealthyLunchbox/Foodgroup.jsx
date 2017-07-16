/* global cms */
/**
 * Created by Chris Dorward on 16/01/2017
 * templates/HealthyLunchbox/Foodgroup
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import ScreenSelector from './ScreenSelector/ScreenSelector';
import './HLB.scss';

class Foodgroup extends Component {
  static propTypes = {
    routeParams: PropTypes.any
  }

  componentDidMount() {
    $('html, body').animate({
      scrollTop: $('#screen-selector').offset().top
    }, 'fast');
  }

  render() {
    if (cms.builder === undefined) {
      cms.builder = {};
      cms.builder.cereals = 0;
      cms.builder.salad = 0;
      cms.builder.meat = 0;
      cms.builder.dairy = 0;
      cms.builder.fruit = 0;
      cms.builder.water = 0;
    }
    return (
      <div className="hlb container">
        <div className="row">
          <ScreenSelector
            foodgroup={this.props.routeParams.foodgroup}
          />
        </div>
      </div>
    );
  }
}

export default Foodgroup;
