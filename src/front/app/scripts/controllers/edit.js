'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $routeParams,$http,  authService, discussionService,apiBaseUrl ) {
	authService.ensureLogin();
		
	$http({method: "GET", url: apiBaseUrl + "/documents/"+$routeParams.documentId, withCredentials: true})
	.success(function(data) {
		$scope.document = data;
	});
	
	$scope.edit = function(section) {
		if (! section.isMyContentEditable) {
			section.isMyContentEditable = true;
		}
		else {
			section.isMyContentEditable = false;
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

	$scope.createDiscussion = function(section) {
	};

	$scope.editButtonImage = function(section) {
		return section.isMyContentEditable ? "icon-ok" : "icon-edit";
	};
});
