'use strict';

/**
 * @ngdoc function
 * @name commuterListAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commuterListAppApp
 */
angular.module('commuterListApp')
  .controller('MainCtrl', function ($scope, $firebaseArray, $location, authentication, $rootScope) {
	  
    var countries = firebase.database().ref().child("countries");
    $scope.countries = $firebaseArray(countries);
    /*
    $firebaseArray(countries).$loaded(function(result) {
      $scope.countries = result;
    });
    */
    $scope.openCountry = function(countryCode) {
      $location.path(/country/ + countryCode);
    };

    $rootScope.isUserAuthenticated = function() {
      return authentication.auth().$getAuth();
    };
    
  });
