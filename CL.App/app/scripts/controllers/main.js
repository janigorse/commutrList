'use strict';

/**
 * @ngdoc function
 * @name commuterListAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commuterListAppApp
 */
angular.module('commuterListApp')
  .controller('MainCtrl', function ($scope, $firebaseArray) {
	  var ref = firebase.database().ref().child("routes");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.routes = $firebaseArray(ref);
    

    
	  $scope.newRoute = '';
	  $scope.editRoute = null;
    /*
    $scope.routes = [
      {
        id:1,
        from:'Kot pri Ribnici 10b, 1310 Ribnica',
        to:'Pot k Sejmišču 33, 1000 Ljubljana',
        at: '6:00 AM',
        with: 'car',
        duration: '1 hour 5 minutes'
      },
      {
        id:1,
        from:'Kot pri Ribnici 10b, 1310 Ribnica',
        to:'Pot k Sejmišču 33, 1000 Ljubljana',
        at: '6:00 AM',
        with: 'car',
        duration: '1 hour 5 minutes'
      },
      {
        id:1,
        from:'Kot pri Ribnici 10b, 1310 Ribnica',
        to:'Pot k Sejmišču 33, 1000 Ljubljana',
        at: '6:00 AM',
        with: 'car',
        duration: '1 hour 5 minutes'
      },
      {
        id:1,
        from:'Kot pri Ribnici 10b, 1310 Ribnica',
        to:'Pot k Sejmišču 33, 1000 Ljubljana',
        at: '6:00 AM',
        with: 'car',
        duration: '1 hour 5 minutes'
      },
      {
        id:1,
        from:'Kot pri Ribnici 10b, 1310 Ribnica',
        to:'Pot k Sejmišču 33, 1000 Ljubljana',
        at: '6:00 AM',
        with: 'car',
        duration: '1 hour 5 minutes'
      }
    ];
    */
  });
