(function () {
    'use strict';
    angular
        .module('angularNgTable')
        .factory('dataService', ['$resource', function dataService($resource) {
            return $resource('data.json');
        }]);
}());