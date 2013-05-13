'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $resource, $routeParams) {
	
	/******************************************/
	/** Initialisation and general functions **/
	/******************************************/
	/* Take a MockUser */
	var User = $resource('/mockAPI/user/:id', {id: '@id'});
	$scope.user = User.get({id: $routeParams.userId});
	
	
});


