'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:NewrouteCtrl
 * @description
 * # NewrouteCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  .controller('NewrouteCtrl', function ($scope, NgMap, $firebaseObject, $location) {
    console.log('new route ctrl started..');
    var fireRef = firebase.database();

    $scope.newRoute = {
      startTime: moment('07:00 AM', 'HH:mm a').toDate(),
      endTime: moment('08:00 AM', 'HH:mm a').toDate(),  
      fromAddress: {
        formatted_address: '' 
      } ,
      toAddress: {
        formatted_address: '' 
      } 
    };



    $scope.origin = $scope.newRoute.fromAddress.formatted_address;
    $scope.destination = $scope.newRoute.toAddress.formatted_address;

    $scope.calculateRoute = function() {
      NgMap.getMap().then(function(map) {
        var durationInSeconds = map.directionsRenderers[0].directions.routes[0].legs[0].duration.value;

        //$scope.newRoute.endTime = moment($scope.newRoute.startTime).add(durationInSeconds, 'seconds').toDate();
        $scope.newRoute.endTime = moment(moment($scope.newRoute.startTime).add(durationInSeconds, 'seconds').format('HH:mm a'), 'HH:mm a').toDate();
        $scope.newRoute.hours = moment.duration(durationInSeconds, 'seconds').hours();
        $scope.newRoute.minutes = moment.duration(durationInSeconds, 'seconds').minutes();
        $scope.newRoute.seconds = moment.duration(durationInSeconds, 'seconds').seconds();
        $scope.newRoute.startLocLat = map.directionsRenderers[0].directions.routes[0].legs[0].start_location.lat();
        $scope.newRoute.startLocLng = map.directionsRenderers[0].directions.routes[0].legs[0].start_location.lng();
        $scope.newRoute.endLocLat = map.directionsRenderers[0].directions.routes[0].legs[0].end_location.lat();
        $scope.newRoute.endLocLng = map.directionsRenderers[0].directions.routes[0].legs[0].end_location.lng();
        
        console.log(map.directionsRenderers[0].directions.routes[0].overview_path.length);
        console.log(map.directionsRenderers[0].directions.routes[0].legs[0].distance.text);
        console.log(map.directionsRenderers[0].directions.routes[0].legs[0].duration.text);
        
      });
      
    };

    $scope.saveNewRoute = function(){
      addNewRoute($scope.newRoute);
    };

    function addNewRoute(newRoute) {
      
      
        fireRef.ref('routes').push({
            email: newRoute.email,
            startTime: moment(newRoute.startTime).format('HH:mm a'),
            endTime: moment(newRoute.endTime).format('HH:mm a'),
            travelMode: $scope.travelMode,
            fromAddress: newRoute.fromAddress.name,
            toAddress: newRoute.toAddress.name,
            hours: newRoute.hours,
            minutes: newRoute.minutes,
            seconds: newRoute.seconds,
            startLocLat: newRoute.startLocLat,
            startLocLng: newRoute.startLocLng,
            endLocLat: newRoute.endLocLat,
            endLocLng: newRoute.endLocLng
        });

        $location.path('/main');
    };

    
  });
