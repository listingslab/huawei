/* global cms */
/**
 * Created by Chris Dorward on 20/01/2017
 * containers/App
 */

import React, { Component, PropTypes } from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';
import Loader from '../components/Loader/Loader';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import API from '../API';

import './App.scss';

class App extends Component {

  static propTypes = {
    children: PropTypes.any
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      endPoint: 'app'
    };
  }

  componentDidMount() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    this.returningUser = false;
    let HLBcookieCode = cookie.load('HLBcookieCode');
    if (HLBcookieCode === undefined) {
      HLBcookieCode = this.makeCookieCode();
      const maxAge = 3600 * 24 * 365; // Will expire after 1 year (value is in number of sec.)
      cookie.save('HLBcookieCode', HLBcookieCode, {
        maxAge
      });
    } else {
      this.returningUser = true;
    }
    cms.HLBcookieCode = HLBcookieCode;
    if (cms.init === undefined) {
      const api = new API(this.state.endPoint);
      api.getData(`${this.state.endPoint}`, this.apiCallback.bind(this));
    } else {
      this.reRender();
    }
  }

  reRender() {
    this.setState({
      isLoaded: true
    });
  }

  apiCallback(cmsData) {
    cms.app = cmsData;
    this.setState({
      isLoaded: true
    });
  }

  makeRandomNumber(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() *
    (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
  }

  makeRandomStr(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  makeCookieCode() {
    const cookieCode = `${this.makeRandomStr(3)}-${this.makeRandomNumber(3)}`;
    return cookieCode;
  }

  hideMessage() {
    $('#message').hide();
  }

  fadeInMessage() {
    $('#message').fadeIn(1500);
  }

  render() {
    const { children } = this.props;
    const showLogo = true;
    // If we're loading show the loader
    if (!this.state.isLoaded) {
      const loaderText = 'Loading Healthy Lunchbox';
      const loader = (
        <div className="container">
          <Loader
            text={loaderText}
            showLogo={showLogo}
          />
        </div>);
      return loader;
    }
    if (!this.showMessages) {
      return (
        <div className="template-app">
          <Header />
          <div id="hlb-content">
            {children}
          </div>
          <Footer />

        </div>
      );
    }
    return (
      <div className="template-app">
        <Header />
        <div id="hlb-content">
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;

/*

const messageType = 'info';
const showDismiss = true;
const showCookies = false;
const showDeleteCookies = true;

const showSuppress = true;
this.showMessages = false;

const HLBcookieSuppress = cookie.load('HLBcookieSuppress');
if (HLBcookieSuppress === 'yes') {
  this.showMessages = false;
}

const firstMessage = `<p>Your unique cookie code is <strong>${cms.HLBcookieCode}</strong></p>
<p>Please quote this as a reference if you have any problems of issues with this website.</p>`;
const firstTitle = 'Hello and welcome';
const secondMessage = '';
const secondTitle = `Welcome back, ${cms.HLBcookieCode}`;
let title = firstTitle;
let message = firstMessage;
if (this.returningUser) {
  title = secondTitle;
  message = secondMessage;
}


<div id="message">
  <Message
    type={messageType}
    showDismiss={showDismiss}
    showCookies={showCookies}
    showDeleteCookies={showDeleteCookies}
    showSuppress={showSuppress}
    title={title}
    message={message}
     />
</div>
*/
