'use strict';

angular.module('pie')
.controller('LoginController', function ($scope, $resource, $routeParams) {
	var Document = $resource('/api/document/:id', {id: '@id'});
	$scope.document = Document.get($routeParams.documentId);
});
