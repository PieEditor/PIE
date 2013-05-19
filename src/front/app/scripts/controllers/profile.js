'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $location, $resource, authService, $http, apiBaseUrl, apiBaseUrlEscaped) {
	var token = authService.ensureLoginAndReturnToken();
	
	var User = $resource(apiBaseUrlEscaped + '/user', {token: token});
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
		$http.delete(apiBaseUrl + '/documents/' + document.id + '?token=' + token)
		.success(function() {
			$scope.user = User.get(); // refresh the user
		});
	};
});