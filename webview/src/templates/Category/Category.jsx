/* global editor */
/* global cms */
/**
 * Created by Chris Dorward on 16/01/2017
 * templates/Category/Category
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import CardRecipeItem from '../../components/CardRecipeItem/CardRecipeItem';
import CardText from '../../components/CardText/CardText';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import HealthySwap from '../../components/HealthySwap/HealthySwap';
import './Category.scss';

class Category extends Component {
  static propTypes = {
    routeParams: PropTypes.any,
    route: PropTypes.any
  }

  componentDidMount() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  getItemsInCatSlug(slug) {
    const recipeCats = cms.app.data.recipes.categories;
    for (let i = 0; i < recipeCats.length; i += 1) {
      if (recipeCats[i].slug === slug) {
        return recipeCats[i];
      }
    }
    const tipCats = cms.app.data.tips.categories;
    for (let i = 0; i < tipCats.length; i += 1) {
      if (tipCats[i].slug === slug) {
        return tipCats[i];
      }
    }
    return false;
  }

  render() {
    const catType = this.props.routeParams.slug;
    let pageHead = null;
    let pageSubHead = null;
    if (catType === 'packed-lunches') {
      pageHead = (
        <div className="packed-lunch-header margin-bottom-25">
          <div className="row">
            <div className="col-md-12" >
              <h1>{cms.app.data.special.data.packed_lunch_category_hero_text || ''}</h1>
              <div className="image-center">
                <img
                  alt="Healthy Lunch Box"
                  className="img-responsive"
                  src="/img/hero_graphic.png"
                />
              </div>
            </div>
          </div>
        </div>
      );
      pageSubHead = (
        <h3 className="text-center margin-bottom-15">{cms.app.data.special.data.packed_lunch_page_sub_heading || ''}</h3>
      );
    }

    const category = this.getItemsInCatSlug(this.props.routeParams.slug);
    const categoriesArr = [];
    const ideasArr = [];

    const categories = category.items;
    for (let i = 0; i < categories.length; i += 1) {
      const key = `cat_${i}`;
      let image = '';
      if (categories[i].acf.image !== false) {
        image = categories[i].acf.image.url;
      }
      // console.log(categories[i].post_type);
      if (categories[i].post_type === 'recipe') {
        categoriesArr.push(
          <div key={key} className="col-md-4 col-sm-6 row-eq-height">
            <CardRecipeItem
              route={`/recipe/${categories[i].post_name}`}
              title={categories[i].post_title}
              subTitle={categories[i].acf.short_description || ''}
              tabText="Easy to freeze"
              preparation_time={categories[i].preparation_time || ''}
              veg_serves={categories[i].veg_serves || ''}
              cooking_time={categories[i].acf.cooking_time || ''}
              freezable={categories[i].acf.freezable || false}
              image={image}
              acf={categories[i].acf || {}}
            />
          </div>
        );
      }
      if (categories[i].post_type === 'packed_lunch') {
        categoriesArr.push(
          <div key={key} className="col-md-4 col-sm-6 row-eq-height">
            <CardText
              key={key}
              cardData={categories[i]}
            />
          </div>
        );
      }
      if (categories[i].post_type === 'healthy_swap') {
        categoriesArr.push(
          <HealthySwap
            key={key}
            swapData={categories[i]}
          />
        );
      }
      if (categories[i].post_type === 'idea') {
        ideasArr.push(
          <div key={key} className="col-md-4 col-sm-6 row-eq-height">
            <CardText
              key={key}
              cardData={categories[i]}
            />
          </div>
        );
      }
    }
    categoriesArr.push(ideasArr);

    return (
      <div className="container">
        <div className="row">
          <Breadcrumb
            route={this.props.route}
            thisTitle={category.title}
          />
          <div className="container">
              <h1>{category.title}</h1>
              <p>{category.subTitle}</p>
              {pageHead}
              {pageSubHead}
              <div className="row">
                {categoriesArr}
              </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Category;

/*
import EditLink from '../../components/EditLink/EditLink';
let editBtn = null;
if (editor) { editBtn = (<EditLink editUrl={category.editUrl} />); }
{editBtn}
*/
