'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $resource, $routeParams, discussionService) {
	var Document = $resource('/api/document/:id', {id: '@id'});
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
		discussionService.currentDiscussion = discussion;
	};

	$scope.createDiscussion = function(section) {
	};

	$scope.editButtonImage = function(section) {
		return section.isMyContentEditable ? "icon-ok" : "icon-edit";
	};
});