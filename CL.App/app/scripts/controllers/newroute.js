'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:NewrouteCtrl
 * @description
 * # NewrouteCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  .controller('NewrouteCtrl', function ($scope, NgMap, $firebaseObject, $location, $route, countryService) {
    var fireRef = firebase.database();
    $scope.newRoute = initNewRoute();
    $scope.origin = $scope.newRoute.fromAddress.formatted_address;
    $scope.destination = $scope.newRoute.toAddress.formatted_address;

    $scope.calculateRoute = function() {
      NgMap.getMap().then(function(map) {
        var durationInSeconds = (map.directionsRenderers[0].directions != "undefined") ? map.directionsRenderers[0].directions.routes[0].legs[0].duration.value : null;
        $scope.newRoute.endTime = moment(moment($scope.newRoute.startTime).add(durationInSeconds, 'seconds').format('HH:mm a'), 'HH:mm a').toDate();
        $scope.newRoute.hours = moment.duration(durationInSeconds, 'seconds').hours();
        $scope.newRoute.minutes = moment.duration(durationInSeconds, 'seconds').minutes();
        $scope.newRoute.startLocLat = map.directionsRenderers[0].directions.routes[0].legs[0].start_location.lat();
        $scope.newRoute.startLocLng = map.directionsRenderers[0].directions.routes[0].legs[0].start_location.lng();
        $scope.newRoute.endLocLat = map.directionsRenderers[0].directions.routes[0].legs[0].end_location.lat();
        $scope.newRoute.endLocLng = map.directionsRenderers[0].directions.routes[0].legs[0].end_location.lng();        
        $scope.newRoute.waypoints = resolveWaypoints(map.directionsRenderers[0].directions);
        
        countryService.getCountryName($scope.newRoute.startLocLat, $scope.newRoute.startLocLng).then(function(country){
          $scope.newRoute.startCountry = country.countryName;
        });
        
        countryService.getCountryName($scope.newRoute.endLocLat, $scope.newRoute.endLocLng).then(function(country){
          $scope.newRoute.endCountry = country.countryName;
        });
      });
      
    };

    $scope.calculateDuration = function() {
      var durationBasedOnStartEnd = moment($scope.newRoute.endTime).diff(moment($scope.newRoute.startTime), 'seconds');
      $scope.newRoute.hours = moment.duration(durationBasedOnStartEnd, 'seconds').hours();
      $scope.newRoute.minutes = moment.duration(durationBasedOnStartEnd, 'seconds').minutes();
      
      countryService.getCountryName($scope.newRoute.startLocLat, $scope.newRoute.startLocLng).then(function(country){
        console.log(country);
        countryExists(country.countryName);
      });
      
      countryService.getCountryName($scope.newRoute.endLocLat, $scope.newRoute.endLocLng).then(function(country){
        console.log(country);
        countryExists(country.countryName);
      });

      
    };

    $scope.saveNewRoute = function(){
      addNewRoute($scope.newRoute);
      incrementNumberOfRoutesForCountry($scope.newRoute.startCountry, $scope.newRoute.endCountry);
      $location.path('/main');
    };

    $scope.clearRoute = function() {
      $route.reload();
    };

    function initNewRoute() {
      return {
        startTime: moment('07:00 AM', 'HH:mm a').toDate(),
        endTime: moment('08:00 AM', 'HH:mm a').toDate(),  
        fromAddress: {
          formatted_address: '' 
        } ,
        toAddress: {
          formatted_address: '' 
        }
      } 
    };

    function addNewRoute(newRoute) {      
        fireRef.ref('routes').push({
            email: newRoute.email,
            startTime: moment(newRoute.startTime).format('HH:mm a'),
            endTime: moment(newRoute.endTime).format('HH:mm a'),
            travelMode: $scope.travelMode,
            fromAddress: newRoute.fromAddress.formatted_address,
            toAddress: newRoute.toAddress.formatted_address,
            hours: newRoute.hours,
            minutes: newRoute.minutes,
            startLocLat: newRoute.startLocLat,
            startLocLng: newRoute.startLocLng,
            endLocLat: newRoute.endLocLat,
            endLocLng: newRoute.endLocLng,
            waypoints: newRoute.waypoints,
            startCountry: newRoute.startCountry,
            endCountry: newRoute.endCountry
        });
    };

    function resolveWaypoints(directions) {
      var waypoints = [];
      var waypoint = {};

      if (directions.request.waypoints) {
        var waypointsArray = directions.request.waypoints
        angular.forEach(waypointsArray, function(wayPoint) {
          waypoint.stopover = wayPoint.stopover;
          waypoint.location = {
            lat: wayPoint.location.lat(),
            lng: wayPoint.location.lng()
          }
          waypoints.push(waypoint);
        }); 
      }
      
      return waypoints;
    };

    function incrementNumberOfRoutesForCountry(startCountry, endCountry) {
      var startCountry = $firebaseObject(fireRef.ref('countries').child(startCountry));
      var endCountry = $firebaseObject(fireRef.ref('countries').child(endCountry));
      var modifiedStartCountry = {};
      var modifiedEndCountry = {};

      startCountry.$loaded(function(data){
        data.numberOfRoutes = data.numberOfRoutes + 1;
        modifiedStartCountry = data;

        endCountry.$loaded(function(data){
          data.numberOfRoutes = data.numberOfRoutes + 1;
          modifiedEndCountry = data;

          modifiedStartCountry.$save();
          modifiedEndCountry.$save();
        });
      });

      

      
      

      
    };

    function countryExists(countryName) {
      var countries = fireRef.ref('countries');
      countries.once('value', function(snapshot) {
        if (snapshot.hasChild(countryName)) {
          console.log(countryName + ' country exists!');
        }
        else {
          console.log(countryName + ' country does not exists!');
        }
      });
    };

    function addNewCountry(countryCode, countryName) {
      fireRef.ref('countries').set({
        countryName: {
          code:countryCode,
          numberOfRoutes: 0,
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/commutrlist.appspot.com/o/country_default.jpeg?alt=media&token=0c2a67ef-c4f4-4747-bd09-d49050db1137"
        }
      });
    };
  });
