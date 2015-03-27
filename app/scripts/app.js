;(function(window, document, undefined) {

'use strict';

var angular = require('angular'),
    ngRoute = require('angular-route');


var app = angular.module('app', ['ngRoute']);

require('./controllers');

// Configura rotas.
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

  .when(
  '/', {
      redirectTo: '/home'
  })

  .when('/home', {
      templateUrl : 'views/pages/home.html',
      controller  : 'HomeCtrl'
  })

  .when('/page', {
      templateUrl : 'views/pages/page.html',
      controller  : 'PageCtrl'
  })

  .when('/404', {
      templateUrl : '404.html'
  })

  // Caso não seja nenhum desses, redirecione para a 404.
  .otherwise ({ redirectTo: '/404' });


  // Remove o # da url
  $locationProvider.html5Mode(true);

}]);


})(window, document);