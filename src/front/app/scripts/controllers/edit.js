'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $resource, $routeParams) {
	var Document = $resource('/api/document/:id', {id: '@id'});
	$scope.document = Document.get($routeParams.documentId);

	$scope.isMyContentEditable = false;

	$scope.edit = function() {
		if (! $scope.isMyContentEditable) {
			$scope.isMyContentEditable = true;
		}
		else {
			$scope.isMyContentEditable = false;
			$scope.document.$save();
		}
	};

	$scope.editButtonText = function() {
		return $scope.isMyContentEditable ? "Save" : "Edit";
	};
});