'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $location, $resource, authService) {
	var token = authService.ensureLoginAndReturnToken();
	
	var User = $resource('http://localhost\\:8080/user', {token: token});
	$scope.user = User.get();

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