'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $location, $resource, authService, $http, apiBaseUrl) {
	authService.ensureLogin()
	.success(function(data) {
		$scope.user = data;
	});
	
	$scope.logout = function() {
		authService.logout()
		.success(function() {
			$location.path("/");
		});
	};

	$scope.deleteDocument = function(document) {
		$http({method: "DELETE", url: apiBaseUrl + "/documents/"  + document.id, withCredentials: true})
		.success(function(data) {
			// Refresh the user
			$http({method: "GET", url: apiBaseUrl + "/user", withCredentials: true})
			.success(function(data) {
				$scope.user = data;
			});
		});
	};
});