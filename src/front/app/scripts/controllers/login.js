'use strict';

angular.module('pie')
.controller('LoginController', function ($scope, $resource, $routeParams, $location, authService) {
	
	/******************************************/
	/** Initialisation and general functions **/
	/******************************************/

	/* Initialise important variables */
	$scope.terms =  { text : 'Terms and Conditions', checked : false } ;
	
	/* Clean alerts */
	$scope.cleanAlerts = function() {
		$scope.registrationPasswordDontMatchAlert = "none";	
		$scope.registrationUserNameAlreadyUseAlert = "none";	
		$scope.termsAndConditionsUncheckedAlert= "none";
		$scope.invalidForgotEmailAlert = "none";
	};
	
	$scope.cleanAlerts();
	
	/**********************/
	/** Login Management **/
	/**********************/
	$scope.getLog = function() {
		authService.login($scope.userName, $scope.password)
		.success(function() {
			$location.path('/profile/');
		})
		.error(function() {
			alert('Login failure!');
		});
	};
	
	/*****************************/
	/** Registration Management **/
	/*****************************/
	$scope.getRegistration = function() {
		$scope.cleanAlerts();
		/* Check if the new user agreed the Terms and Conditions */
		if ($scope.terms.checked === false) {
			$scope.termsAndConditionsUncheckedAlert = "true";
			return;
		}

		/* Check if the passwords are matching */
		if ($scope.newPassword !== $scope.newReTypePassword) {
			$scope.registrationPasswordDontMatchAlert = "true";
			return;
		}
		
		/* Registration Sucess */
		authService.register($scope.newUserName, $scope.newPassword, $scope.newEmail, $scope.newImage)
		.success(function() { // success callback
			$location.path('/profile/');
		})
		.error(function() { // error callback
			$scope.registrationUserNameAlreadyUseAlert = "true";
		});
	};
});

angular.module('pie')
.controller('termsAndConditionsModalCtrl', function ($scope, $resource, $routeParams) {
	$scope.open = function () {
		$scope.termsAndConditionsModal = true;
	};

	$scope.close = function () {
		$scope.closeMsg = 'I was closed at: ' + new Date();
		$scope.termsAndConditionsModal = false;
	};

	$scope.opts = {
		backdropFade: true,
		dialogFade:true
	};
});