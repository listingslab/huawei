/* global cms */
/* global editor */
/**
 * Created by Chris Dorward on 05/02/2017
 * components/ScreenSelector/ScreenSelector
 */

import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import EditLink from '../../../components/EditLink/EditLink';
import CardFooditem from '../CardFooditem/CardFooditem';

function ScreenSelector(props) {
  let hidden = true;
  const backClicked = () => {
    browserHistory.push('/healthy-lunch-box/');
  };

  const makeMarkup = (html) => {
    return { __html: html };
  };

  const toggleArrow = () => {
    $('#arrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up', 200);
    hidden = hidden !== true;
    if (hidden) {
      $('#more_info_text').html(cms.app.data.lunchbox.content.data.show_more_info_text);
    } else {
      $('#more_info_text').html(cms.app.data.lunchbox.content.data.hide_more_info_text);
    }
  };

  const foodgroups = cms.app.data.lunchbox.foodgroups;
  let foodgroupData = null;
  for (let i = 0; i < foodgroups.length; i += 1) {
    if (props.foodgroup === foodgroups[i].category.slug) {
      foodgroupData = foodgroups[i];
      break;
    }
  }


  const items = [];
  for (let i = 0; i < foodgroupData.items.length; i += 1) {
    const key = `item_${i}`;
    items.push (
      <CardFooditem
        key={key}
        foodgroup={props.foodgroup}
        itemData={foodgroupData.items[i]}
      />
    );
  }

  const headerClass = `builder-screen-2-header foodgroup-${props.foodgroup}`;
  let editBtn = null;
  if (editor) { editBtn = (<EditLink editUrl={foodgroupData.editUrl || ''} />); }

  return (
    <div id="screen-selector" className="container">
      <div className="row">
        <div className={headerClass}>

          <div
            onClick={backClicked}
            className="row builder-screen-2-header-back builder-screen-2-header-bkg"
          >
            <span className="glyphicon glyphicon-arrow-left btn-lg" aria-hidden="true" />
          </div>

          <div className="row row-eq-height">
            <div className="col-sm-1 hidden-xs" />
              <div className="col-xs-2 col-sm-1">
                <img
                  alt={foodgroupData.info.foodgroup_name}
                  src={foodgroupData.info.icon}
                  className="img-responsive builder-screen-2-header-img"
                />
              </div>
              <div className="col-xs-4 col-sm-4 builder-screen-2-header-title">
                <h2 dangerouslySetInnerHTML={makeMarkup(foodgroupData.info.foodgroup_name)} />
              </div>
              <div className="col-xs-6 col-sm-5 builder-screen-2-header-text">
                <h4 dangerouslySetInnerHTML={makeMarkup(foodgroupData.info.foodgroup_leader)} />
              </div>
              <div className="col-md-1 hidden-xs" />
            </div>

            <div className="row">
              <a
                onClick={toggleArrow}
                data-toggle="collapse"
                href="#collapseExample"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
              <div className="col-xs-12 builder-screen-2-extend" >
                  <h4><span id="more_info_text">{cms.app.data.lunchbox.content.data.show_more_info_text}</span>
                    <span id="arrow" className="glyphicon glyphicon-chevron-down btn-lg" aria-hidden="true" />
                  </h4>
              </div>
              </a>
            </div>

            <div className="collapse" id="collapseExample">
              <div className="row builder-screen-2-top-border">

                <div className="col-xs-12 builder-screen-2-expand">
                  <div className="col-sm-1 hidden-xs" />
                  <div className="col-sm-5 builder-screen-2-expand-title hidden-xs">
                    <h3 dangerouslySetInnerHTML={makeMarkup(foodgroupData.info.info_left)} />
                  </div>
                  <div className="col-sm-5 col-xs-12 builder-screen-2-expand-text">
                    <p className="visible-xs" />
                    <p dangerouslySetInnerHTML={makeMarkup(foodgroupData.info.info_right)} />
                  </div>
                  <div className="col-sm-1 hidden-xs" />
                </div>

                <div className="col-xs-12 builder-screen-2-expand serveinfo">
                  <div className="col-sm-1 hidden-xs" />
                  <div className="col-sm-5">
                    <h3 className="dark-text">{foodgroupData.info.serve_size_title || ''}</h3>
                    <img
                      alt={foodgroupData.info.serve_size_title || ''}
                      src={foodgroupData.info.serve_size_graphic || ''}
                      className="img-responsive builder-screen-2-infographics-img-expanded"
                    />
                  </div>

                  <div className="col-sm-5 col-xs-12">
                    <h3 className="dark-text">{foodgroupData.info.serves_per_day_title || ''}</h3>
                    <img
                      alt={foodgroupData.info.serves_per_day_title || ''}
                      src={foodgroupData.info.serves_per_day_graphic || ''}
                      className="img-responsive builder-screen-2-infographics-img-expanded"
                    />
                  </div>
                  <div className="col-sm-1 hidden-xs" />
                </div>
              </div>
          </div>
        </div>

        <div className="row builder-screen-2-cards">
          <div className="col-md-12 builder-screen-2-cards-title">
            <h4>{cms.app.data.lunchbox.content.data.select_instruction || 'Select one to pack it'}</h4>
          </div>

          <div className="container">
            <div className="row">
              {items}
            </div>
          </div>

        </div>
      </div>
      {editBtn}
    </div>
  );
}

ScreenSelector.propTypes = {
  foodgroup: PropTypes.string.isRequired
};

export default ScreenSelector;

/*
*/
