'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $http, $routeParams, authService) {
	var token = authService.ensureLoginAndReturnToken();

	$http.get('http://localhost:8080/user', {token: token})
	.success(function(data) {
		console.log(data);
	});
});