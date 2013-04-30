'use strict';

angular.module('pie')
.controller('LoginController', function ($scope, $resource, $routeParams) {
	
	/******************************************/
	/** Initialisation and general functions **/
	/******************************************/
	/* Take a MockUser */
	var User = $resource('/api/user/:id', {id: '@id'});
	$scope.user = User.get({id: 1});  // Baptiste : Paul à quoi sert l'id ici utilisé dans discuss.js, ça marche sans non ? 
	
	/* Initialise important variables */
	$scope.menuTabLogin = "active";
	$scope.menuTabRegister="";
	$scope.menuTabPaneLogin= "active";
	$scope.menuTabPaneRegister= "";
	
	/* Clean alerts */
	$scope.cleanAlerts = function() {
		$scope.loginFailureAlert = "none";
		$scope.loginUsernameEmptyAlert = "none";
		$scope.loginPasswordEmptyAlert = "none";
		$scope.loginSucessAlert = "none";
		$scope.registrationPasswordDontMatchAlert = "none";	
		$scope.registrationUsernameEmptyAlert = "none";	
		$scope.registrationPasswordEmptyAlert = "none";	
		$scope.registrationEmailEmptyAlert = "none";
		$scope.registrationUserNameAlreadyUseAlert = "none";	
		$scope.registrationEmailAdresseAlreadyUseAlert = "none";	
		$scope.registrationSucessAlert = "none";	
	};
	
	$scope.cleanAlerts();
	
	/**********************/
	/** Login Management **/
	/**********************/
	$scope.getLog = function() {
		/* Check if the username is empty */
		if ($scope.userName === '' || $scope.userName === undefined)  {
			$scope.cleanAlerts();
			$scope.loginUsernameEmptyAlert = "true";
			return;
		}
		
		/* Check if the password is empty */
		if ( $scope.password==='' || $scope.password=== undefined)  { 
			$scope.cleanAlerts();
			$scope.loginPasswordEmptyAlert = "true";
			return;
		}
		
		/* check if the login if correct */
		if ( $scope.user.name === $scope.userName && $scope.user.password === $scope.password  ) {
			$scope.cleanAlerts();
			$scope.loginSucessAlert = "true"
		} else {
			$scope.cleanAlerts();
			$scope.loginFailureAlert = "true";		
		}
		
	};
	
	/*****************************/
	/** Registration Management **/
	/*****************************/
	$scope.getRegistration = function() {
		/* Check if the username is empty */
		if ($scope.newUserName === '' || $scope.newUserName === undefined)  {
			$scope.cleanAlerts();
			$scope.registrationUsernameEmptyAlert = "true";
			return;
		}
		
		/* Check if the password is empty */
		if ( $scope.newPassword==='' || $scope.newPassword=== undefined)  { 
			$scope.cleanAlerts();
			$scope.registrationPasswordEmptyAlert = "true";
			return;
		}
		
		/* Check if the passwords are matching */
		if ( $scope.newPassword !== $scope.newReTypePassword ) {
			$scope.cleanAlerts();
			$scope.registrationPasswordDontMatchAlert = "true";
			return;
		}
		
		/* check if the email adresse is empty */
		if ( $scope.newEmail ==='' || $scope.newEmail === undefined ) {
			$scope.cleanAlerts();
			$scope.registrationEmailEmptyAlert = "true";
			return;	
		}
		
		/* Check if the username is already used */    //TODO 
		if ( $scope.user.name === $scope.newUserName ) {
			$scope.cleanAlerts();
			$scope.registrationUserNameAlreadyUseAlert = "true";
			return;
		}
		
		/* Check if the email adresse is already used */    //TODO 
		if ( $scope.newEmail === $scope.user.email ) {
			$scope.cleanAlerts();
			$scope.registrationEmailAdresseAlreadyUseAlert = "true";
			return;
		}
		
		/* Registration Sucess */
		$scope.cleanAlerts();
		$scope.registrationSucessAlert = "true";
		return;
	};
	
	/**************************/
	/** Side Menu Management **/
	/**************************/
	$scope.menuClickOnLogin = function () {
		$scope.menuTabRegister="";
		$scope.menuTabLogin = "active";
		$scope.menuTabPaneRegister= "";
		$scope.menuTabPaneLogin= "active";
	};
	
	$scope.menuClickOnRegister = function () {
		$scope.menuTabLogin = "";
		$scope.menuTabRegister="active";
		$scope.menuTabPaneLogin= "";
		$scope.menuTabPaneRegister= "active";
	};
	
});
