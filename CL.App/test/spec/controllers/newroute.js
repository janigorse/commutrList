'use strict';

describe('Controller: NewrouteCtrl', function () {

  // load the controller's module
  beforeEach(module('commuterListApp'));

  var NewrouteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewrouteCtrl = $controller('NewrouteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

 
});
