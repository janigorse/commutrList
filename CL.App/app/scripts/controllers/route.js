'use strict';

angular.module('commuterListApp')
  .controller('DisplayRouteCtrl', function ($scope, NgMap, $firebaseObject, $location, $routeParams, $uibModal) {
      var routeId = $routeParams.routeId;
      var fireRef = firebase.database();
      $scope.route = $firebaseObject(fireRef.ref('routes').child(routeId));
      $scope.showEmail = false;
      $scope.route.$loaded(function(data){
          $scope.showWaypoint = (data.waypoints === undefined) ? false: true;
      });

      $scope.openPaymentModal = function() {
          $uibModal.open({
              templateUrl:'views/paymentModal.html',
              controller: 'PaymentModalCtrl',
              size: 'sm'
          }).result.then(function () {
              $scope.showEmail = true;
          });
      };
      
  })

  .controller('PaymentModalCtrl', function($scope, $uibModalInstance) {
    $scope.buy = function () {
        $uibModalInstance.close();
    };
  })
  ;