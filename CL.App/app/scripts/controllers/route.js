'use strict';

angular.module('commuterListApp')
.controller('DisplayRouteCtrl', function ($scope, NgMap, $firebaseObject, $location, $routeParams, $uibModal, $http, countryService, $window, authentication) {
    var routeId = $routeParams.routeId;
    var fireRef = firebase.database();
    $scope.route = $firebaseObject(fireRef.ref('routes').child(routeId));
    $scope.showEmail = false;
    $scope.showEmailRow = false;
    $scope.route.$loaded(function(data){
        $scope.showEmailRow = showEmailRow(data);
        $scope.showWaypoint = (data.waypoints === undefined) ? false: true;
        var startLocationCountry = countryService.getCountryName(data.startLocLat, data.startLocLng);
        var endLocationCountry = countryService.getCountryName(data.endLocLat, data.endLocLng);

        $scope.allowEditRemove = function() {
            return authentication.auth().$getAuth() && authentication.auth().$getAuth().uid === data.uid;
        };
    });

    $scope.removeRoute = function() {
        $uibModal.open({
            templateUrl:'views/deleteConfirmationModal.html',
            controller: 'DeleteModalCtrl',
            size: 'sm'
        }).result.then(function(data){
            if (data === 'delete') {
                decrementNumberOfRoutesForCountry($scope.route.startCountry, $scope.route.endCountry);
                $scope.route.$remove();
                $window.history.back();
            }
        });
    };

    $scope.editRoute = function() {
        $location.path("/editroute/" + $scope.route.$id);
    };

    $scope.openPaymentModal = function() {
        $uibModal.open({
            templateUrl:'views/paymentModal.html',
            controller: 'PaymentModalCtrl',
            size: 'sm'
        }).result.then(function () {
            $scope.showEmail = true;
            //sendMailToBuyer();
        });
    };

    function decrementNumberOfRoutesForCountry(startCountry, endCountry) {
      var start = $firebaseObject(fireRef.ref('countries').child(startCountry));
      var end = $firebaseObject(fireRef.ref('countries').child(endCountry));

      start.$loaded(function(data){
        if (data.numberOfRoutes > 0) {
            start.numberOfRoutes = data.numberOfRoutes - 1;
            start.$save();
        }

        end.$loaded(function(data){
            if (data.numberOfRoutes > 0) {
                end.numberOfRoutes = data.numberOfRoutes - 1;
                end.$save();
            }
        });
      });
      
    }

    function sendMailToBuyer () {
        var mailgunUrl = "commutrlist.com";
        var mailgunApiKey = window.btoa("api:key-af78d2996b730a64687ea34a1702d717");
        var recipient = "john.gorse@hotmail.com";
        var subject = "CommutrList - Your commute partner's mail";
        var message = "Hi, This is your commute partner's email: ";
        
        $http({
            "method": "POST",
            "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + mailgunApiKey
            },
            data: "from=" + "test@example.com" + "&to=" + recipient + "&subject=" + subject + "&text=" + message
        })
        .then(function(success) {
            console.log("SUCCESS " + JSON.stringify(success));
        }, function(error) {
            console.log("ERROR " + JSON.stringify(error));
        });
        
    }

    function showEmailRow(route) {
        return route.travelMode === "DRIVING";
    }
    
})

.controller('PaymentModalCtrl', function($scope, $uibModalInstance) {
    $scope.buy = function () {
        $uibModalInstance.close();
    };
})

.controller('DeleteModalCtrl', function($scope, $uibModalInstance) {
    $scope.delete = function () {
        $uibModalInstance.close('delete');
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };
})
;