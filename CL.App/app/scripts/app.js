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
        templateUrl: 'views/editroute.html',
        controller: 'EditRouteCtrl',
        controllerAs: 'newroute',
        resolve: {
          "currentAuth": ["authentication", function(authentication){
            var auth = authentication.auth();
            return auth.$requireSignIn();
          }]
        }
      })
      .when('/editroute/:routeId', {
        templateUrl: 'views/editroute.html',
        controller: 'EditRouteCtrl',
        controllerAs: 'editroute',
        resolve: {
          "currentAuth": ["authentication", function(authentication){
            var auth = authentication.auth();
            return auth.$requireSignIn();
          }]
        }
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
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          "logout": ["authentication", function(authentication) {
            authentication.logout();
          }]
        }
      })
      .when('/join', {
        templateUrl: 'views/join.html',
        controller: 'JoinCtrl',
        controllerAs: 'join'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      
  })
  .run(['$rootScope', '$location', function($rootScope, $location){
    $rootScope.$on('$routeChangeError', function(event, next, previous, error){
      if (error === "AUTH_REQUIRED") {
        console.log("auth req");
        $location.path("/login");
      }
    })
  }])
  
  ;
