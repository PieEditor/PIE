'use strict';

angular.module('pie', ['ngResource', 'ngMockE2E', 'ngCookies', 'ui.bootstrap'])
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
			.when('/editAndDiscuss/:documentId', {
				templateUrl: 'views/editAndDiscuss.html'
			})
			.when('/createNewDoc', {
				templateUrl: 'views/createNewDoc.html'
			})
			.when('/profile', {
				templateUrl: 'views/profile.html'
			})
			.when('/login', {
				templateUrl: 'views/login.html'
			})
			.otherwise({
				templateUrl: 'views/404.html'
			});
	});
