'use strict';

angular.module('pie', ['ngResource', 'ui.bootstrap'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/login'
			})
			.when('/discuss/:discussionId', {
				templateUrl: 'views/discuss.html'
			})
			.when('/edit/:documentId', {
				templateUrl: 'views/edit.html'
			})
			.when('/editAndDiscuss/:documentId/:sectionIndex/:discussionIndex', {
				templateUrl: 'views/editAndDiscuss.html'
			})
			.when('/editAndDiscuss/:documentId', {
				templateUrl: 'views/editAndDiscuss.html'
			})
			.when('/architecture/:documentId', {
				templateUrl: 'views/architecture.html'
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
	})
	.constant('apiBaseUrl', 'http://' + document.domain + ':8080');
