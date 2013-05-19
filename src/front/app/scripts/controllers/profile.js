'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $location, $resource, authService, $http) {
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

	$scope.deleteDocument = function(document) {
		$http.delete('http://localhost:8080/documents/' + document.id + '?token=' + token)
		.success(function() {
			$scope.user = User.get(); // refresh the user
		});
	};
});