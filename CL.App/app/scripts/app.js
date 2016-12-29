'use strict';

/**
 * @ngdoc overview
 * @name commuterListAppApp
 * @description
 * # commuterListAppApp
 *
 * Main module of the application.
 */
angular
  .module('commuterListApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'google.places',
    'ngMap',
    'angularMoment',
    'firebase',
    'ui.bootstrap',
    'angulartics', 
    'angulartics.google.analytics',
    'angular-loading-bar'
  ])
  .config(function ($routeProvider) {
     // Initialize Firebase
      var config = {
        apiKey: "AIzaSyANnz8pl4M2VA7Z5j6OR_ox_JvPpWgK09Y",
        authDomain: "commutrlist.firebaseapp.com",
        databaseURL: "https://commutrlist.firebaseio.com",
        storageBucket: "commutrlist.appspot.com",
        messagingSenderId: "419935267587"
      };
      firebase.initializeApp(config);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/newroute', {
        templateUrl: 'views/newroute.html',
        controller: 'NewRouteCtrl',
        controllerAs: 'newroute'
      })
      .when('/editroute/:routeId', {
        templateUrl: 'views/newroute.html',
        controller: 'NewRouteCtrl',
        controllerAs: 'editroute'
      })
      .when('/route/:routeId', {
        templateUrl: 'views/route.html',
        controller: 'DisplayRouteCtrl',
        controllerAs: 'displayroute'
      })
      .when('/country/:countryCode', {
        templateUrl: 'views/country.html',
        controller: 'CountryCtrl',
        controllerAs: 'country'
      })
      .otherwise({
        redirectTo: '/'
      });

      
  });
