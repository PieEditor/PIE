'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $http, $routeParams, authService) {
	var token = authService.ensureLoginAndReturnToken();

	var d = {token: token};

	$http.get('http://localhost:8080/user', {params: d} )
	.success(function(data) {
		console.log(data);
	});
});