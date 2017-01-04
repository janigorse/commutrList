'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  .controller('JoinCtrl', function ($scope, authentication, $window) {
    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.register = function() {
      var result = authentication.createUser($scope.credentials.email, $scope.credentials.password);
      result.then(function(userData){
        console.log('user ok: ' + userData);
        $window.location.href = "/";
      },
      function(error){
        console.log('error occured', error);
      })
    };
  });
