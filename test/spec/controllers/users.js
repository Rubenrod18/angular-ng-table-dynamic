'use strict';

describe('Controller: usersCtrl', function () {

  // load the controller's module
  beforeEach(module('apiApp'));

  var usersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    usersCtrl = $controller('usersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(usersCtrl.awesomeThings.length).toBe(3);
  });
});
