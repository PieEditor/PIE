'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $routeParams,$http,  authService, discussionService,apiBaseUrl ) {
	authService.ensureLogin();	
	$http({method: "GET", url: apiBaseUrl + "/documents/"+$routeParams.documentId, withCredentials: true})
	.success(function(data) {
		$scope.document = data;

		_.map($scope.document.content, function(c) {
			// If we have some content, then show it (isMyContentEditable = false)
			// If we don't, show the editing field (isMyContentEditable = true)
			c.isMyContentEditable = ! c.content;
		});
	});
	$scope.edit = function(section) {
		if (! section.isMyContentEditable) {
			section.isMyContentEditable = true;
		}
		else {
			section.isMyContentEditable = ! section.content;
			$http({
				method: "PUT",
				url: apiBaseUrl + "/documents/"+$routeParams.documentId,
				data : $scope.document,
				withCredentials: true
			});
		}
	};

	$scope.showDiscussion = function(discussion) {
		discussionService.get(discussion.id);
	};
	$scope.modifiedArchitecture = function() {
		
	};
	$scope.createDiscussion = function(section) {
	};
});
