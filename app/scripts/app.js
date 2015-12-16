(function () {
    'use strict';
    angular
        .module('angularNgTable', [
            'ui.router',
            'ui.bootstrap',
            'ngAnimate',
            'oitozero.ngSweetAlert',
            'ngTable',
            'ngSanitize',
            'ngCsv',
            'ngResource'
        ])
        .config(['$httpProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('index/home');
            $stateProvider
                .state('index', {
                    abstract: true,
                    url: '/index',
                    templateUrl: 'views/common/base.html',
                })
                .state('index.home', {
                    url: '/home',
                    templateUrl: 'views/users/index.html',
                    controller: 'usersCtrl',
                    controllerAs: 'usersCtrl'
                });
        }]);
}());
