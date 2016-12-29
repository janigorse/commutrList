'use strict';

/**
 * @ngdoc function
 * @name commuterListAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commuterListAppApp
 */
angular.module('commuterListApp')
  .controller('MainCtrl', function ($scope, $firebaseArray, $location) {
	  
    var countries = firebase.database().ref().child("countries");
    $firebaseArray(countries).$loaded(function(result) {
      console.log(result);
      $scope.countries = result;
    });
    
    $scope.openCountry = function(countryCode) {
      $location.path(/country/ + countryCode);
    };
  });
