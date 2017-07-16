/* global editor */
/* global cms */
/**
 * Created by Chris Dorward on 31/01/2017
 * templates/Tips/Tips
 */

import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import EditLink from '../../components/EditLink/EditLink';
import CardTipCat from '../../components/CardTipCat/CardTipCat';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Tips.scss';

class Tips extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      taxonomy: 'tips'
    };
  }

  componentDidMount() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  makeMarkup(){
    return { __html: cms.app.data.tips.post.post_content };
  }

  render() {
    const title = cms.app.data.tips.post.post_title || '';
    let editBtn = null;
    if (editor) {
      editBtn = (
        <EditLink
          editUrl={cms.app.data.tips.editUrl || ''}
        />
      );
    }
    const categoriesArr = [];
    const categories = cms.app.data.tips.categories;
    const colours = ['green', 'blue', 'purple', 'orange'];
    let colourIndex = -1;
    for (let i = 0; i < categories.length; i += 1) {
      colourIndex += 1;
      if (colourIndex === 4) {
        colourIndex = 0;
      }
      const colour = colours[colourIndex];
      // console.log(colourIndex);
      let cols = 'col-md-6';
      if (i === 0) {
        cols = 'col-md-12';
      }
      const key = `cardcat_${i}`;
      // console.log(categories[i]);
      categoriesArr.push(
        <div
          key={key}
          className={cols}
        >
          <CardTipCat
            route={categories[i].route}
            title={categories[i].title || ''}
            subTitle={categories[i].subTitle || ''}
            colour={colour}
            image={categories[i].image || ''}
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

export default Tips;
