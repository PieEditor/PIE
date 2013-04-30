'use strict';

angular.module('pie')
.controller('LoginController', function ($scope, $resource, $routeParams) {
	var User = $resource('/api/user/:id', {id: '@id'});
	$scope.user = User.get({id: 1});  // Baptiste : Paul à quoi sert l'id ici utilisé dans discuss.js, ça marche sans non ? 
	
	$scope.loginFailureAlert = "none";
	$scope.loginUsernameEmptyAlert = "none";
	$scope.loginPasswordEmptyAlert = "none";
	$scope.loginSucessAlert = "none"
	
	
	$scope.getLog = function() {
		
		/* Check if the username is empty */
		if ($scope.userName === '' || $scope.userName === undefined)  {
			$scope.loginFailureAlert = "none";
			$scope.loginUsernameEmptyAlert = "true";
			$scope.loginPasswordEmptyAlert = "none";
			$scope.loginSucessAlert = "none"
			return;
		}
		
		/* Check if the password is empty */
		if ( $scope.password==='' || $scope.password=== undefined)  { 
			$scope.loginFailureAlert = "none";
			$scope.loginUsernameEmptyAlert = "none";
			$scope.loginPasswordEmptyAlert = "true";
			$scope.loginSucessAlert = "none"
			return;
		}
		
		/* check if the login if correct */
		if ( $scope.user.name === $scope.userName && $scope.user.password === $scope.password  ) {
			$scope.loginFailureAlert = "none";
			$scope.loginUsernameEmptyAlert = "none";
			$scope.loginPasswordEmptyAlert = "none";
			$scope.loginSucessAlert = "true"
		} else {
			$scope.loginFailureAlert = "true";
			$scope.loginUsernameEmptyAlert = "none";
			$scope.loginPasswordEmptyAlert = "none";
			$scope.loginSucessAlert = "none"		}
		
	};
	
});
