;(function(window, document, undefined) {

'use strict';

var app = require('angular').module('app');

app.controller('HomeCtrl', require('./home'));
app.controller('PageCtrl', require('./page'));

})(window, document);