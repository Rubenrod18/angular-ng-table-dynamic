(function () {
'use strict';
    angular
        .module('angularNgTable')
        .directive('markable', function () {
            return {
                restrict: 'A',
                link: function postLink(scope, element, attrs) {
                    element.on('click', function () {
                        if (element.attr('style')) {
                            element.removeAttr('style');
                        } else {
                            element.attr('style', 'background: #E3F0F6');
                        }
                    });
                }
            };
        });
}());