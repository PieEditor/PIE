'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $location, $resource, authService, $http, apiBaseUrl, apiBaseUrlEscaped) {
	authService.ensureLogin();
	
	var User = $resource(apiBaseUrlEscaped + '/user');
	$scope.user = User.get();

	$scope.logout = function() {
		authService.logout(
			function() { // success callback
				$location.path("/");
			},
			function() {} // error callback
		);
	};

	$scope.deleteDocument = function(document) {
		$http.delete(apiBaseUrl + '/documents/' + document.id)
		.success(function() {
			$scope.user = User.get(); // refresh the user
		});
	};
});