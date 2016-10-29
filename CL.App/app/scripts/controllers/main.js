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
	  var ref = firebase.database().ref().child("routes");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.routes = $firebaseArray(ref);
    

    
	  $scope.newRoute = '';
	  $scope.editRoute = null;
    
    $scope.openRoute = function(routeId) {
      console.log(routeId);
      $location.path(/route/ + routeId);
    }
  });
