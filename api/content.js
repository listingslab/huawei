'use strict';

let Loki = require('lokijs');
let content = new Loki(__dirname + '/content.json');

module.exports = content;