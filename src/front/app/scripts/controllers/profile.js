'use strict';

angular.module('pie')
.controller('ProfileController', function ($scope, $resource, $routeParams, $cookieStore) {
	/******************************************/
	/** Initialisation and general functions **/
	/******************************************/
	/* Take a MockUser */
	// var User = $resource('/mockAPI/user/:id', {id: '@id'});
	// $scope.user = User.get({id: $routeParams.userId});

	console.log($cookieStore.get('authenticated'));
	console.log($cookieStore.get('token'));
});