/**
 * Created by Chris Dorward on 28/01/2017
 * API
 */

import $ from 'jquery';

export default class API {

  constructor(apiRoute) {
    this.apiBaseUrl = 'http://api.healthylunchbox.com.au/wp-json/hlbapi/';
    this.apiUrl = `${this.apiBaseUrl}${apiRoute}`;
    this.homeData = false;
    this.state = {
      isLoaded: false,
      isFetching: false,
      cmsData: false
    };
  }

  getData(apiRoute, callBack) {
    if (!this.homeData) {
      $.getJSON(`${this.apiBaseUrl}${apiRoute}`, callBack);
    }
  }
}
