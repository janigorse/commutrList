'use strict';

angular.module('commuterListApp')
.controller('DisplayRouteCtrl', function ($scope, NgMap, $firebaseObject, $location, $routeParams, $uibModal, $http) {
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

    var sendMailToBuyer = function() {
        var mailgunUrl = "YOUR_DOMAIN_HERE";
        var mailgunApiKey = window.btoa("api:key-YOUR_API_KEY_HERE")
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
        
    };
    
})

.controller('PaymentModalCtrl', function($scope, $uibModalInstance) {
    $scope.buy = function () {
        $uibModalInstance.close();
    };
})
;