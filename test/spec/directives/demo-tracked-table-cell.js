'use strict';

describe('Directive: demoTrackedTableCell', function () {

  // load the directive's module
  beforeEach(module('apiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<demo-tracked-table-cell></demo-tracked-table-cell>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the demoTrackedTableCell directive');
  }));
});
