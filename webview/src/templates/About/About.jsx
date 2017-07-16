/* global editor */
/* global cms */
/**
 * Created by Chris Dorward on 18/01/2017
 * templates/About/About
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import EditLink from '../../components/EditLink/EditLink';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

class About extends Component {
  static propTypes = {
    route: PropTypes.any
  }

  componentDidMount() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  makeMarkup(html) {
    return { __html: html };
  }

  render() {
    let editBtn = null;
    if (editor) {
      editBtn = (
        <EditLink
          editUrl={cms.app.data.about.editUrl}
        />
      );
    }
    return (
      <div className="container">
        <div className="row margin-top-25">
          <Breadcrumb
            route={this.props.route}
            thisTitle={cms.app.data.about.post.post_title}
          />
            <div className="container">
              <div className="row" >
                <div className="raised-page" >
                  <h2>
                    <div
                      dangerouslySetInnerHTML={this.makeMarkup(cms.app.data.about.acf.about_leader)}
                    />
                  </h2>
                  <div className="yellow-line col-md-3" />
                  <div className="clear-both" />
                  <div
                    dangerouslySetInnerHTML={this.makeMarkup(cms.app.data.about.acf.about_fulltext)}
                  />
                </div>
              </div>
            </div>
            <div className="row margin-top-25">
              {editBtn}
            </div>
        </div>
      </div>
    );
  }
}

export default About;
