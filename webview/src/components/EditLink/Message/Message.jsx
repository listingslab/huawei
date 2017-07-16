/**
 * Created by Chris Dorward on 24/01/2017
 * components/Message/Message
 */

import React, { PropTypes } from 'react';
import $ from 'jquery';
import cookie from 'react-cookie';
import { Link, browserHistory } from 'react-router';
import './Message.scss';

function Message(props) {
  const reload = () => {
    location.reload();
  };

  const dismissMessage = () => {
    $('#message').fadeOut();
  };

  const showCookies = () => {
    // console.log('showCookies');
    browserHistory.push('/cookies');
    $('#message').fadeOut();
  };

  const deleteCookies = () => {
    const HLBcookieCode = cookie.load('HLBcookieCode');
    if (HLBcookieCode !== undefined) {
      cookie.remove('HLBcookieCode', { path: '/' });
      cookie.remove('HLBcookieSuppress', { path: '/' });
    }
    $('#message').fadeOut();
    $('#root').fadeOut(500);
    setTimeout(reload, 500);
  };

  const suppressMessages = () => {
    let HLBcookieSuppress = cookie.load('HLBcookieSuppress');
    // console.log(`Current HLBcookieSuppress... ${HLBcookieSuppress}`);
    if (HLBcookieSuppress === undefined) {
      console.log(`Save HLBcookieSuppress... ${HLBcookieSuppress}`);
      HLBcookieSuppress = 'yes';
      const maxAge = 3600 * 24 * 365; // Will expire after 1 year (value is in number of sec.)
      cookie.save('HLBcookieSuppress', HLBcookieSuppress, {
        maxAge
      });
    }
    $('#message').fadeOut();
  };

  const className = `alert alert-${props.type}`;
  const messageMarkup = { __html: props.message };
  let dismissBtn = '';
  if (props.showDismiss) {
    dismissBtn = (<button
      title="Dismiss this message"
      onClick={dismissMessage}
      className="btn btn-success message-btn">
      <span className="glyphicon glyphicon-ok-sign" />Dismiss this message</button>);
  }
  let cookiesBtn = '';
  if (props.showCookies) {
    cookiesBtn = (<Link
      title="What do cookies mean for you?"
      onClick={showCookies}
      className="btn btn-warning message-btn">
      <span className="glyphicon glyphicon-info-sign" />What do cookies mean for you?</Link>);
  }

  let cookiesDeleteBtn = '';
  if (props.showDeleteCookies) {
    cookiesDeleteBtn = (<Link
      title="Delete cookies"
      onClick={deleteCookies}
      className="btn btn-info message-btn">
      <span className="glyphicon glyphicon-remove-sign" />Delete cookies and start over?</Link>);
  }


  let suppressBtn = '';
  if (props.showSuppress) {
    suppressBtn = (<button
      title="Suppress all messages"
      onClick={suppressMessages}
      className="btn btn-info message-btn">
      <span className="glyphicon glyphicon-remove-sign" />Suppress further messages.</button>);
  }

  const buttonsDiv = (
    <div className="message-buttons">
      {cookiesBtn}
      {cookiesDeleteBtn}
      {suppressBtn}
      {dismissBtn}
    </div>
  );

  return (
    <div className={className} role="alert">
        <h5>{props.title}</h5>
        <div dangerouslySetInnerHTML={messageMarkup} />
        {buttonsDiv}
    </div>
  );
}

Message.propTypes = {
  type: PropTypes.string.isRequired,
  showDismiss: PropTypes.bool.isRequired,
  showCookies: PropTypes.bool.isRequired,
  showDeleteCookies: PropTypes.bool.isRequired,
  showSuppress: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default Message;

/*
<div className="alert alert-success" role="alert">
  <strong>Well done!</strong> You successfully read this important alert message.
</div>
<div className="alert alert-info" role="alert">
  <strong>Heads up!</strong> This alert needs your attention.
</div>
<div className="alert alert-warning" role="alert">
  <strong>Warning!</strong> Best check yo self.
</div>
<div className="alert alert-danger" role="alert">
  <strong>Oh snap!</strong> Change a few things up and try submitting again.
</div>
*/
