'use strict';

/**
 * @ngdoc function
 * @name commuterListApp.controller:NewrouteCtrl
 * @description
 * # NewrouteCtrl
 * Controller of the commuterListApp
 */
angular.module('commuterListApp')
  .controller('EditRouteCtrl', function ($scope, NgMap, $firebaseObject, $location, $route, countryService, $routeParams, moment, firebase, authentication) {

    $scope.calculateRoute = function() {
      NgMap.getMap().then(function(map) {
        var durationInSeconds = (map.directionsRenderers[0].directions !== "undefined") ? map.directionsRenderers[0].directions.routes[0].legs[0].duration.value : null;
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
    };

    $scope.saveNewRoute = function(){
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
      if ($scope.routeId) {
        $firebaseObject(fireRef.ref('routes').child($scope.routeId)).$loaded(function(data) {
          var authenticated =  authentication.auth().$getAuth();
          if (authenticated && authenticated.uid === data.uid) {
            $scope.oldRoute = angular.copy(data);
            $scope.newRoute = {
                  email: data.email,
                  startTime: moment(data.startTime,'HH:mm a').toDate(),
                  endTime: moment(data.endTime, 'HH:mm a').toDate(),
                  travelMode: data.travelMode,
                  fromAddress: {formatted_address: data.fromAddress},
                  toAddress: {formatted_address: data.toAddress},
                  hours: data.hours,
                  minutes: data.minutes,
                  startLocLat: data.startLocLat,
                  startLocLng: data.startLocLng,
                  endLocLat: data.endLocLat,
                  endLocLng: data.endLocLng,
                  waypoints: data.waypoints,
                  startCountry: data.startCountry,
                  endCountry: data.endCountry,
                  uid: data.uid
              };
          }
          else {
            $location.path("/");
          }
        });
      }
      else {
        $scope.origin = '';
        $scope.destination = '';
        $scope.newRoute = initNewRoute();
      }
    }

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
      }; 
    }

    function addNewRoute(newRoute) {  
      if ($scope.routeId) {
        fireRef.ref('routes').child($scope.routeId).set({
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
              endCountry: newRoute.endCountry,
              uid: authentication.auth().$getAuth().uid,
              note: newRoute.note
          }, function() {

            if ($scope.oldRoute.startCountry !== newRoute.startCountry) {
              decrementNumberOfRoutesForCountry($scope.oldRoute.startCountry);
              incrementNumberOfRoutesForCountry(newRoute.startCountry);
            }

            if ($scope.oldRoute.endCountry !== newRoute.endCountry) {
              decrementNumberOfRoutesForCountry($scope.oldRoute.endCountry);
              incrementNumberOfRoutesForCountry(newRoute.endCountry);
            }
        });
      }
      else {
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
              endCountry: newRoute.endCountry,
              uid: authentication.auth().$getAuth().uid,
              note: newRoute.note
          }, function() {
            //incrementNumberOfRoutesForCountry(newRoute.startCountry, newRoute.endCountry);
            incrementNumberOfRoutesForCountry(newRoute.startCountry);
            incrementNumberOfRoutesForCountry(newRoute.endCountry);
        });
      }
        
    }

    function resolveWaypoints(directions) {
      var waypoints = [];
      var waypoint = {};

      if (directions.request.waypoints) {
        var waypointsArray = directions.request.waypoints;
        angular.forEach(waypointsArray, function(wayPoint) {
          waypoint.stopover = wayPoint.stopover;
          waypoint.location = {
            lat: wayPoint.location.lat(),
            lng: wayPoint.location.lng()
          };
          waypoints.push(waypoint);
        }); 
      }
      
      return waypoints;
    }
    
    function incrementNumberOfRoutesForCountry(country) {
      var countryObject = $firebaseObject(fireRef.ref('countries').child(country));
      countryObject.$loaded(function(data){
        countryObject.numberOfRoutes = data.numberOfRoutes + 1;
        countryObject.$save();
      });
    }

    function decrementNumberOfRoutesForCountry(country) {
      var countryObject = $firebaseObject(fireRef.ref('countries').child(country));
      countryObject.$loaded(function(data){
        if (data.numberOfRoutes > 0) {
          countryObject.numberOfRoutes = data.numberOfRoutes - 1;
          countryObject.$save();
        }
      });
    }

    function addNewCountryAndReturnBool(countryCode, countryName) {
      fireRef.ref('countries').child(countryName).set({        
          code:countryCode,
          numberOfRoutes: 0,
          photoUrl: ""
      }, function(error) {
        if (error) {
          return false;
        }
        else {
          return true;
        }
      });
    }

    $scope.routeId = $routeParams.routeId;
    var fireRef = firebase.database();
    getRoute();

  });
