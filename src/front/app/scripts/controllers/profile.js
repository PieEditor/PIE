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
		if ( ! confirm(' Are you sure you want to delete '+ document.title))return;
		$http({method: "DELETE", url: apiBaseUrl + "/documents/"  + document.docId, withCredentials: true})
		.success(function() {
			var index = _.indexOf($scope.user.documents.owner, document);
			$scope.user.documents.owner.splice(index, 1);
		});
	};
});
