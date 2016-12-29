'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:NewrouteCtrl
 * @description
 * # NewrouteCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  .controller('NewRouteCtrl', function ($scope, NgMap, $firebaseObject, $location, $route, countryService, $routeParams) {
    var routeId = $routeParams.routeId;
    var fireRef = firebase.database();
    $scope.newRoute = getRoute();
    

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
      var startCountryExists = countryExists($scope.newRoute.startCountry);
      var endCountryExists = countryExists($scope.newRoute.endCountry);
      var countries = fireRef.ref('countries');

      countries.once('value', function(snapshot) {
        if (!snapshot.hasChild($scope.newRoute.startCountry)) {
          countryService.getCountryName($scope.newRoute.startLocLat, $scope.newRoute.startLocLng).then(function(country){
            addNewCountryAndReturnBool(country.countryCode, country.countryName);  
          });  
        }

        if (!snapshot.hasChild($scope.newRoute.endCountry)) {
          countryService.getCountryName($scope.newRoute.endLocLat, $scope.newRoute.endLocLng).then(function(country){
            addNewCountryAndReturnBool(country.countryCode, country.countryName);  
          });  
        }
        
      });
      
      addNewRoute($scope.newRoute);
      
      $location.path('/');
    };

    $scope.clearRoute = function() {
      $route.reload();
    };

    function getRoute() {
      if (routeId) {
        return $firebaseObject(fireRef.ref('routes').child(routeId));
      }
      else {
        $scope.origin = '';
        $scope.destination = '';
        return initNewRoute();
      }
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
        }, function(complete) {
          incrementNumberOfRoutesForCountry(newRoute.startCountry, newRoute.endCountry);
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
      var start = $firebaseObject(fireRef.ref('countries').child(startCountry));
      var end = $firebaseObject(fireRef.ref('countries').child(endCountry));

      start.$loaded(function(data){
        start.numberOfRoutes = data.numberOfRoutes + 1;
        start.$save();

        end.$loaded(function(data){
          end.numberOfRoutes = data.numberOfRoutes + 1;
          end.$save();
        });
      });
      
    };

    function countryExists(countryName) {
      var countries = fireRef.ref('countries');
      countries.once('value', function(snapshot) {
        if (snapshot.hasChild(countryName)) {
          return true;
        }
        else {
          return false;
        }
      });
    };

    function addNewCountryAndReturnBool(countryCode, countryName) {
      fireRef.ref('countries').child(countryName).set({        
          code:countryCode,
          numberOfRoutes: 0,
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/commutrlist.appspot.com/o/country_default.jpeg?alt=media&token=0c2a67ef-c4f4-4747-bd09-d49050db1137"
      }, function(error) {
        if (error) {
          return false;
        }
        else {
          return true;
        }
      });
    };
  });
