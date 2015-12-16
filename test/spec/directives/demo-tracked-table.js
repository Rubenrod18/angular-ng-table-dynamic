'use strict';

describe('Directive: demoTrackedTable', function () {

  // load the directive's module
  beforeEach(module('apiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<demo-tracked-table></demo-tracked-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the demoTrackedTable directive');
  }));
});
