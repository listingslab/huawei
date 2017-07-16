/* global editor */
/* global cms */
/**
 * Created by Chris Dorward on 31/01/2017
 * templates/Recipes/Recipes
 */

import React, { Component } from 'react';
import $ from 'jquery';
import EditLink from '../../components/EditLink/EditLink';
import CardCategory from '../../components/CardCategory/CardCategory';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Recipes.scss';

class Recipes extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      post_content: cms.app.data.recipes.post.post_content || null,
      post_title: cms.app.data.recipes.post.post_title || null,
      recipes: cms.app.data.recipes || null,
      taxonomy: 'recipes'
    };
  }

  componentDidMount() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  makeMarkup() {
    return { __html: this.state.post_content };
  }

  render() {
    const title = this.state.post_title || '';
    let editBtn = null;
    if (editor) {
      editBtn = (
        <EditLink
          editUrl={this.state.recipes.editUrl || ''}
        />
      );
    }
    const categoriesArr = [];
    const categories = this.state.recipes.categories;
    const colours = ['purple', 'orange', 'green', 'blue'];
    let colourIndex = -1;
    for (let i = 0; i < categories.length; i += 1) {
      colourIndex += 1;
      if (colourIndex === 4){
        colourIndex = 0;
      }
      const colour = colours[colourIndex];
      // console.log(colourIndex);
      let cols = 'col-md-6';
      if (i === 0) {
        cols = 'col-md-12';
      }
      const key = `cat_${i}`;
      let countText = 'Recipes';
      if (categories[i].slug === 'packed-lunches') {
        countText = 'Examples';
      }
      categoriesArr.push(
        <div
          key={key}
          className={cols}
        >
          <CardCategory
            route={categories[i].route}
            title={categories[i].title || ''}
            subTitle={categories[i].subTitle || ''}
            numberItems={categories[i].items.length}
            colour={colour}
            itemType="recipe"
            countText={countText}
            image={categories[i].image}
          />
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row margin-top-25">
          <Breadcrumb
            route={this.props.route}
            thisTitle={title}
          />
          <div className="container">
              <h1>{title}</h1>
              <div dangerouslySetInnerHTML={this.makeMarkup()} />
              {categoriesArr}
          </div>
          {editBtn}
        </div>
      </div>
    );
  }
}

export default Recipes;
