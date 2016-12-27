'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:CountryCtrl
 * @description
 * # CountryCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  .controller('CountryCtrl', function ($scope, $firebaseArray, $location, $routeParams) {
    var countryCode = $routeParams.countryCode;
    var routesByStartCountryCode = firebase.database().ref().child("routes").orderByChild("startCountry").equalTo(countryCode);
    var routesByEndCountryCode = firebase.database().ref().child("routes").orderByChild("endCountry").equalTo(countryCode);
    var filteredRoutes = $firebaseArray(routesByStartCountryCode).$loaded()
      .then(function(result) {
        if (result.length > 0) {
          $scope.routes = result;
        }
        else {
          $scope.routes = $firebaseArray(routesByEndCountryCode);
        }
        
      })
      .catch(function(error) {
        console.log("Error:", error);
      });

	  $scope.newRoute = '';
	  $scope.editRoute = null;
    
    $scope.openRoute = function(routeId) {
      $location.path(/route/ + routeId);
    };
  });
