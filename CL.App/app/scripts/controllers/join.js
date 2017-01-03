'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:JoinCtrl
 * @description
 * # JoinCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  .controller('JoinCtrl', function ($scope, authentication) {
    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.register = function() {
      var result = authentication.createUser($scope.credentials.email, $scope.credentials.password);
      result.then(function(userData){
        console.log('user ok: ' + userData);
      },
      function(error){
        console.log('error occured', error);
      })
    };
  });
