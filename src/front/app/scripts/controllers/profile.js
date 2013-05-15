'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $http, $location, authService) {
	var token = authService.ensureLoginAndReturnToken();

	var d = {token: token};

	$http.get('http://localhost:8080/user', {params: d} )
	.success(function(data) {
		$scope.user = data.user;
	});

	$scope.logout = function() {
		authService.logout(
			function() { // success callback
				$location.path("/");
			},
			function() { // error callback
			}
		);
	};
});