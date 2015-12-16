(function () {
    'use strict';
    angular
        .module('angularNgTable')
        .directive('pwCheck', [function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    var password = $('input[ng-model="' + attrs.pwCheck + '"]');
                    element.add(password).on('keyup', function () {
                        scope.$apply(function () {
                            ctrl.$setValidity('pwmatch', element.val() === $(password).val());
                        });
                    });
                }
            };
        }]);
}());