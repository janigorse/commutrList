'use strict';

angular.module('commuterListApp')
.factory('authentication', function ($firebaseAuth, firebase) {
    var authentication = {};
    var auth = $firebaseAuth();
    authentication.createUser = function(email, password) {
        return auth.$createUserWithEmailAndPassword(email, password);
    };

    authentication.authUser = function(email, password) {
        return auth.$signInWithEmailAndPassword(email, password);
    };

    authentication.logout = function() {
        auth.$signOut();
    }

    authentication.auth = function() {
        return auth;
    }
    
    return authentication;
});