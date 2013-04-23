'use strict';

angular.module('pie', [])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/discuss', {
				templateUrl: 'views/discuss.html'
			})
			.when('/edit', {
				templateUrl: 'views/edit.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
