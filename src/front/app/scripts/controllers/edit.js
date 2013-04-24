'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $resource) {
	var Document = $resource('/api/document/:id', {id: '@id'});
	$scope.document = Document.get({id: 1});
});