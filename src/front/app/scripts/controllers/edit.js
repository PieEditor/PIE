'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $resource, $routeParams, discussionService) {
	var Document = $resource('/mockAPI/document/:id', {id: '@id'});
	$scope.document = Document.get({id: $routeParams.documentId});

	$scope.isMyContentEditable = false;

	$scope.edit = function(section) {
		if (! section.isMyContentEditable) {
			section.isMyContentEditable = true;
		}
		else {
			section.isMyContentEditable = false;
			$scope.document.$save({id: $scope.document.id});
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