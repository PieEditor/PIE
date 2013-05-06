'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $resource, $routeParams) {
	var Document = $resource('/api/document/:id', {id: '@id'});
	$scope.document = Document.get($routeParams.documentId);

	$scope.isMyContentEditable = false;

	$scope.edit = function(section) {
		if (! section.isMyContentEditable) {
			section.isMyContentEditable = true;
		}
		else {
			section.isMyContentEditable = false;
			$scope.document.$save();
		}
	};

	$scope.editButtonText = function(section) {
		return section.isMyContentEditable ? "Save" : "Edit";
	};
});