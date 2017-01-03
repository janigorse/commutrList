'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  
  .controller("LoginCtrl", function($scope, authentication) {
    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.signin = function() {
      var result = authentication.authUser($scope.credentials.email, $scope.credentials.password);
      result.then(function(userData){
        console.log('user ok: ' + userData.uid);
      },
      function(error){
        console.log('error occured', error);
      })
    };
});
