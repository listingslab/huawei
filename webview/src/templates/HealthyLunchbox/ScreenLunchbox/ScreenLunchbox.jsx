/* global cms */
/* global editor */
/**
 * Created by Chris Dorward on 04/02/2017
 * components/ScreenLunchbox/ScreenLunchbox
 */

import React from 'react';
import { browserHistory, Link } from 'react-router';
import YourTip from '../YourTip/YourTip';
import CardRecipeItem from '../../../components/CardRecipeItem/CardRecipeItem';


function ScreenLunchbox(props) {
  const yourTips = [];
  const yourRecipes = [];
  let completedItems = 0;
  const foodgroupClicked = (foodgroup) => {
    cms.builder.currentFoodgroup = foodgroup;
    browserHistory.push(`/healthy-lunch-box/${cms.builder.currentFoodgroup}`);
  };

  const addYourRecipe = (slug) => {
    let recipeData = null;
    const key2 = `yourRecipes_${completedItems}`;
    for (let i = 0; i < cms.app.data.recipes.categories.length; i += 1) {
      const catRecipes = cms.app.data.recipes.categories[i].items;
      for (let j = 0; j < catRecipes.length; j += 1) {
        if (slug === catRecipes[j].post_name) {
          recipeData = catRecipes[j];
        }
      }
    }
    yourRecipes.push(
      <div
        key={key2}
        className="col-md-4"
      >
        <CardRecipeItem
          route={`/recipe/${recipeData.post_name}`}
          title={recipeData.post_title}
          subTitle={recipeData.acf.short_description || ''}
          tabText="Easy to freeze"
          preparation_time={recipeData.preparation_time || ''}
          veg_serves={recipeData.veg_serves || ''}
          cooking_time={recipeData.acf.cooking_time || ''}
          freezable={recipeData.acf.freezable || false}
          image={recipeData.acf.image.url || ''}
          acf={recipeData.acf || {}}
        />
      </div>
    );
  };

  const startOver = () => {
    location.reload();
  };

  const makeMarkup = (html) => {
    return { __html: html };
  };

  const lunchboxHeader = cms.app.data.lunchbox.content.data.lunchbox_header || '';

  let breadsTitle = null;
  let dairyTitle = null;
  let fruitTitle = null;
  let meatTitle = null;
  let vegetablesTitle = null;
  let waterTitle = null;
  let breadsIcon = null;
  let dairyIcon = null;
  let fruitIcon = null;
  let meatIcon = null;
  let vegetablesIcon = null;
  let waterIcon = null;

  for (let i = 0; i < cms.app.data.lunchbox.foodgroups.length; i += 1) {
    switch (cms.app.data.lunchbox.foodgroups[i].category.slug) {
    case 'breads-cereals':
      breadsTitle = cms.app.data.lunchbox.foodgroups[i].info.foodgroup_name;
      breadsIcon = cms.app.data.lunchbox.foodgroups[i].info.icon;
      break;
    case 'dairy':
      dairyTitle = cms.app.data.lunchbox.foodgroups[i].info.foodgroup_name;
      dairyIcon = cms.app.data.lunchbox.foodgroups[i].info.icon;
      break;
    case 'fruit':
      fruitTitle = cms.app.data.lunchbox.foodgroups[i].info.foodgroup_name;
      fruitIcon = cms.app.data.lunchbox.foodgroups[i].info.icon;
      break;
    case 'meat-alternatives':
      meatTitle = cms.app.data.lunchbox.foodgroups[i].info.foodgroup_name;
      meatIcon = cms.app.data.lunchbox.foodgroups[i].info.icon;
      break;
    case 'vegetables-salads':
      vegetablesTitle = cms.app.data.lunchbox.foodgroups[i].info.foodgroup_name;
      vegetablesIcon = cms.app.data.lunchbox.foodgroups[i].info.icon;
      break;
    case 'water':
      waterTitle = cms.app.data.lunchbox.foodgroups[i].info.foodgroup_name;
      waterIcon = cms.app.data.lunchbox.foodgroups[i].info.icon;
      break;
    default:
      break;
    }
  }

  let cereals = null;
  if (cms.builder.cereals === 0) {
    cereals = (
      <div
        onClick={() => foodgroupClicked('breads-cereals')}
        className="itemClickable row builder-1-bottom-dash builder-1-right-dash builder-screen-1-tile"
      >
        <div
          className="col-xs-5 col-md-5 builder-screen-1-tile-center">
          <img
            alt={breadsTitle}
            src={breadsIcon}
            className="builder-screen-1-img builder-screen-1-align img-responsive"
          />
        </div>
        <div
          className="col-xs-7 col-md-7 builder-screen-1-align">
          <h2 dangerouslySetInnerHTML={makeMarkup(breadsTitle)} />
        </div>
      </div>);
  } else {
    completedItems += 1;
    const key = `yourTips_${completedItems}`;
    yourTips.push(
      <YourTip
        key={key}
        tipData={cms.builder.cereals}
        icon={breadsIcon}
      />
    );
    if (cms.builder.cereals.acf.recipe_slug !== undefined
      && cms.builder.cereals.acf.recipe_slug !== '') {
      addYourRecipe(cms.builder.cereals.acf.recipe_slug);
    }
    cereals = (
      <div
        onClick={() => foodgroupClicked('breads-cereals')}
        className="itemSelected row builder-1-bottom-dash builder-1-right-dash builder-screen-1-tile"
      >
        <div
          className="col-xs-5 col-md-5 builder-screen-1-tile-center">
          <img
            alt={breadsTitle}
            src={cms.builder.cereals.acf.image || breadsIcon}
            className="builder-screen-1-img builder-screen-1-align img-responsive"
          />
        </div>
        <div
          className="col-xs-7 col-md-7 builder-screen-1-align">
          <h2 dangerouslySetInnerHTML={makeMarkup(breadsTitle)} />
        </div>
      </div>);
  }

  let salad = null;
  if (cms.builder.salad === 0) {
    salad = (
      <div
        onClick={() => foodgroupClicked('vegetables-salads')}
        className="itemClickable row builder-1-right-dash builder-screen-1-tile"
      >
        <div className="col-xs-5 col-md-5 builder-screen-1-tile-center">
          <img
            alt={vegetablesTitle}
            src={vegetablesIcon}
            className="builder-screen-1-img builder-screen-1-align img-responsive"
          />
        </div>
        <div className="col-xs-7 col-md-7 builder-screen-1-align">
          <h2 dangerouslySetInnerHTML={makeMarkup(vegetablesTitle)} />
        </div>
      </div>
    );
  } else {
    completedItems += 1;
    const key = `yourTips_${completedItems}`;
    yourTips.push(
      <YourTip
        key={key}
        tipData={cms.builder.salad}
        icon={vegetablesIcon}
      />
    );
    if (cms.builder.salad.acf.recipe_slug !== undefined
      && cms.builder.salad.acf.recipe_slug !== '') {
      addYourRecipe(cms.builder.salad.acf.recipe_slug);
    }
    salad = (
      <div
        onClick={() => foodgroupClicked('vegetables-salads')}
        className="itemSelected row builder-1-right-dash builder-screen-1-tile"
      >
        <div className="col-xs-5 col-md-5 builder-screen-1-tile-center">
          <img
            alt={vegetablesTitle}
            src={cms.builder.salad.acf.image || vegetablesIcon}
            className="builder-screen-1-img builder-screen-1-align img-responsive"
          />
        </div>
        <div className="col-xs-7 col-md-7 builder-screen-1-align">
          <h2 dangerouslySetInnerHTML={makeMarkup(vegetablesTitle)} />
        </div>
      </div>
    );
  }

  let meat = null;
  if (cms.builder.meat === 0) {
    meat = (
      <div
        onClick={() => foodgroupClicked('meat-alternatives')}
        className="itemClickable col-xs-4 builder-1-right-dash builder-1-top-dash builder-screen-1-tile builder-screen-1-tile-center "
      >
        <img
          alt={meatTitle}
          src={meatIcon}
          className="builder-screen-1-img img-responsive"
        />
      <h2 dangerouslySetInnerHTML={makeMarkup(meatTitle)} />
      </div>
    );
  } else {
    completedItems += 1;
    const key = `yourTips_${completedItems}`;
    yourTips.push(
      <YourTip
        key={key}
        tipData={cms.builder.meat}
        icon={meatIcon}
      />
    );
    if (cms.builder.meat.acf.recipe_slug !== undefined
      && cms.builder.meat.acf.recipe_slug !== '') {
      addYourRecipe(cms.builder.meat.acf.recipe_slug);
    }
    meat = (
      <div
        onClick={() => foodgroupClicked('meat-alternatives')}
        className="itemSelected col-xs-4 builder-1-right-dash builder-1-top-dash builder-screen-1-tile builder-screen-1-tile-center "
      >
        <img
          alt={meatTitle}
          src={cms.builder.meat.acf.image || meatIcon}
          className="builder-screen-1-img img-responsive"
        />
      <h2 dangerouslySetInnerHTML={makeMarkup(meatTitle)} />
      </div>
    );
  }

  let dairy = null;
  if (cms.builder.dairy === 0) {
    dairy = (
      <div
        onClick={() => foodgroupClicked('dairy')}
        className="itemClickable col-xs-4 builder-1-right-dash builder-1-top-dash builder-screen-1-tile builder-screen-1-tile-center"
      >
        <img
          alt={dairyTitle}
          src={dairyIcon}
          className="builder-screen-1-img img-responsive"
        />
      <h2 dangerouslySetInnerHTML={makeMarkup(dairyTitle)} />
      </div>
    );
  } else {
    completedItems += 1;
    const key = `yourTips_${completedItems}`;
    yourTips.push(
      <YourTip
        key={key}
        tipData={cms.builder.dairy}
        icon={dairyIcon}
      />
    );
    if (cms.builder.dairy.acf.recipe_slug !== undefined
      && cms.builder.dairy.acf.recipe_slug !== '') {
      addYourRecipe(cms.builder.dairy.acf.recipe_slug);
    }
    dairy = (
      <div
        onClick={() => foodgroupClicked('dairy')}
        className="itemSelected col-xs-4 builder-1-right-dash builder-1-top-dash builder-screen-1-tile builder-screen-1-tile-center"
      >
        <img
          alt={dairyTitle}
          src={cms.builder.dairy.acf.image || dairyIcon}
          className="builder-screen-1-img img-responsive"
        />
      <h2 dangerouslySetInnerHTML={makeMarkup(dairyTitle)} />
      </div>
    );
  }

  let fruit = null;
  if (cms.builder.fruit === 0) {
    fruit = (
      <div
        onClick={() => foodgroupClicked('fruit')}
        className="itemClickable col-xs-4 builder-1-top-dash builder-screen-1-tile builder-screen-1-tile-center"
      >
        <img
          alt={fruitTitle}
          src={fruitIcon}
          className="builder-screen-1-img img-responsive"
        />
      <h2 dangerouslySetInnerHTML={makeMarkup(fruitTitle)} />
      </div>
    );
  } else {
    completedItems += 1;
    const key = `yourTips_${completedItems}`;
    yourTips.push(
      <YourTip
        key={key}
        tipData={cms.builder.fruit}
        icon={fruitIcon}
      />
    );
    if (cms.builder.fruit.acf.recipe_slug !== undefined
      && cms.builder.fruit.acf.recipe_slug !== '') {
      addYourRecipe(cms.builder.fruit.acf.recipe_slug);
    }
    fruit = (
      <div
        onClick={() => foodgroupClicked('fruit')}
        className="itemSelected col-xs-4 builder-1-top-dash builder-screen-1-tile builder-screen-1-tile-center"
      >
        <img
          alt={fruitTitle}
          src={cms.builder.fruit.acf.image || fruitIcon}
          className="builder-screen-1-img img-responsive"
        />
      <h2 dangerouslySetInnerHTML={makeMarkup(fruitTitle)} />
      </div>
    );
  }

  let water = null;
  if (cms.builder.water === 0) {
    water = (
      <div
        onClick={() => foodgroupClicked('water')}
        className="itemClickable col-xs-4 builder-screen-1-item water-tile"
      >
        <div className="row builder-screen-1-tile builder-screen-1-tile-center">
          <img
            alt={waterTitle}
            src={waterIcon}
            className="builder-screen-1-img-water img-responsive"
          />
        <h2 dangerouslySetInnerHTML={makeMarkup(waterTitle)} />
        </div>
      </div>
    );
  } else {
    completedItems += 1;
    const key = `yourTips_${completedItems}`;
    yourTips.push(
      <YourTip
        key={key}
        tipData={cms.builder.water}
        icon={waterIcon}
      />
    );
    if (cms.builder.water.acf.recipe_slug !== undefined
      && cms.builder.water.acf.recipe_slug !== '') {
      addYourRecipe(cms.builder.water.acf.recipe_slug);
    }
    water = (
      <div
        onClick={() => foodgroupClicked('water')}
        className="itemSelected col-xs-4 builder-screen-1-item water-tile"
      >
        <div className="row builder-screen-1-tile builder-screen-1-tile-center">
          <img
            alt={waterTitle}
            src={waterIcon}
            className="builder-screen-1-img-water img-responsive"
          />
        <h2 dangerouslySetInnerHTML={makeMarkup(waterTitle)} />
        </div>
      </div>
    );
  }

  let promptSmall = null;
  let promptLarge = null;
  let finishSection = null;

  let recipesMore = null;
  if (yourRecipes.length === 0) {
    recipesMore = (
      <div className="margin-bottom-25">
        <h4><Link
          to="recipes"
          className="recipes-more-btn"
        >
          {cms.app.data.lunchbox.content.data.recipes_more || 'Recipes & more'}</Link></h4>
      </div>
    );
  } else {
    recipesMore = (
      <div>
        <h2>{cms.app.data.lunchbox.content.data.recipes_more || 'Recipes & more'}</h2>
        {yourRecipes}
      </div>
    );
  }

  if (completedItems === 0) {
    promptSmall = cms.app.data.lunchbox.content.data.completed_items_s_0 || '';
    promptLarge = cms.app.data.lunchbox.content.data.completed_items_l_0 || '';
  }
  if (completedItems === 1) {
    promptSmall = cms.app.data.lunchbox.content.data.completed_items_s_1 || '';
    promptLarge = cms.app.data.lunchbox.content.data.completed_items_l_1 || '';
  }
  if (completedItems === 2) {
    promptSmall = cms.app.data.lunchbox.content.data.completed_items_s_2 || '';
    promptLarge = cms.app.data.lunchbox.content.data.completed_items_l_2 || '';
  }
  if (completedItems === 3) {
    promptSmall = cms.app.data.lunchbox.content.data.completed_items_s_3 || '';
    promptLarge = cms.app.data.lunchbox.content.data.completed_items_l_3 || '';
  }
  if (completedItems === 4) {
    promptSmall = cms.app.data.lunchbox.content.data.completed_items_s_4 || '';
    promptLarge = cms.app.data.lunchbox.content.data.completed_items_l_4 || '';
  }
  if (completedItems === 5) {
    promptSmall = cms.app.data.lunchbox.content.data.completed_items_s_5 || '';
    promptLarge = cms.app.data.lunchbox.content.data.completed_items_l_5 || '';
  }
  if (completedItems === 6) {
    promptSmall = cms.app.data.lunchbox.content.data.completed_items_s_finished || '';
    promptLarge = cms.app.data.lunchbox.content.data.completed_items_l_finished || '';
    finishSection = (
      <div className="finished-tips">
        <h2 className="finished-tips-top">{cms.app.data.lunchbox.content.data.your_lunchbox_tips || 'Your lunch box tips'}</h2>
        <div className="container">
          <div className="row">
            {yourTips}
          </div>
          <div className="row">
            {recipesMore}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="healthy-lunch-box" className="healthy-lunch-box">
    <div className="container">

      <div className="row margin-bottom-10">
        <div className="builder-screen-1-lunchbox-heading">
          <div className="builder-screen-1-lunchbox-title">
            <h1>{lunchboxHeader}</h1>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="builder-screen-1">
          <div className="builder-screen-1-lunchbox">
            <div className="row builder-1-row-responsive">
              <div className="col-xs-8 builder-screen-1-item">
                {cereals}
                {salad}
              </div>
                {water}
            </div>
            <div className="row row-eq-height builder-1-row-responsive">
              {meat}
              {dairy}
              {fruit}
            </div>
            <div className="border-1-item-tab" />

          </div>

          <div id="start-over" className="builder-1-start-over-button">
            <button
              onClick={startOver}
              className="btn blue-circle-button"
            >
            <img
              alt="start over"
              src="/img/builder/start-over-arrow.png"
              className="img-responsive builder-1-start-over-icon"
            />
            <h4>START<br />OVER</h4>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="border-1-prompt-box">
      <h4>{promptSmall}</h4>
      <h3>{promptLarge}</h3>
    </div>
    {finishSection}
  </div>
  );
}

ScreenLunchbox.propTypes = {

};

export default ScreenLunchbox;

/*
// import EditLink from '../../../components/EditLink/EditLink';
const editURL = 'http://api.healthylunchbox.com.au/wp-admin/post.php?post=1083&action=edit';
let editBtn = null;
if (editor) { editBtn = (<EditLink editUrl={editURL || ''} />); }
*/
