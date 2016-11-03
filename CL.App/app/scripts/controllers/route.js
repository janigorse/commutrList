'use strict';

angular.module('commuterListApp')
  .controller('DisplayRouteCtrl', function ($scope, NgMap, $firebaseObject, $location, $routeParams) {
      console.log('displayroute started..');
      var routeId = $routeParams.routeId;
      var fireRef = firebase.database();
      $scope.route = $firebaseObject(fireRef.ref('routes').child(routeId));
      $scope.route.$loaded(function(data){
          $scope.showWaypoint = (data.waypoints === undefined) ? false: true;
      });
      
  })
  ;