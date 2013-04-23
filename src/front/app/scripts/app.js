'use strict';

angular.module('pie', [])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/discuss', {
				templateUrl: 'views/discuss.html',
				controller: 'DiscussController'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
