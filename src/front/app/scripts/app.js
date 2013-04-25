'use strict';

angular.module('pie', ['ngResource', 'ngMockE2E'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/index.html'
			})
			.when('/discuss/:discussionId', {
				templateUrl: 'views/discuss.html'
			})
			.when('/edit/:documentId', {
				templateUrl: 'views/edit.html'
			})
			.when('/editAndDiscuss/:documentId/:discussionId', {
				templateUrl: 'views/editAndDiscuss.html'
			})
			.otherwise({
				templateUrl: 'views/404.html'
			});
	});
