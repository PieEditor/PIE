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
	$scope.terms =  { text : 'Terms and Conditions', checked : false } ;
	//$scope.termsAndConditionsModal= "hide";
	$scope.forgotPasswordModal= "hide";
	
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
		$scope.termsAndConditionsUncheckedAlert= "none";
		$scope.invalidForgotEmailAlert = "none";
		$scope.emptyForgotPasswordEmail = "none";
		$scope.successForgotPasswordEmail = "none";
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
		
		/* Check if the new user agreed the Terms and Conditions */
		if ( $scope.terms.checked === false ) {
			$scope.cleanAlerts();
			$scope.termsAndConditionsUncheckedAlert = "true";
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
	
	/* login menu show */
	$scope.menuClickOnLogin = function () {
		$scope.cleanAlerts();
		$scope.cleanAllModals();
		$scope.menuTabRegister="";
		$scope.menuTabLogin = "active";
		$scope.menuTabPaneRegister= "";
		$scope.menuTabPaneLogin= "active";
	};
	/* register menu show */
	$scope.menuClickOnRegister = function () {
		$scope.cleanAlerts();
		$scope.cleanAllModals();
		$scope.menuTabLogin = "";
		$scope.menuTabRegister="active";
		$scope.menuTabPaneLogin= "";
		$scope.menuTabPaneRegister= "active";
	};
	
	/**********************/
	/** Modal Management **/
	/**********************/
	
	/* Show Terms and Conditions Modal */
	/*$scope.showTermsAndConditionsModal = function ()  {
		$scope.termsAndConditionsModal= "show";
	};	*/
	/* Show Forgot Password Modal */
	$scope.showForgotPasswordModal = function ()  {
		$scope.forgotPasswordModal= "show";
	};
	/* Close all modals */
	$scope.cleanAllModals = function () {
		$scope.cleanAlerts();
		$scope.forgotPasswordModal= "hide";
		//$scope.termsAndConditionsModal= "hide";
	};
	
	/*********************/
	/** Forgot Password **/
	/*********************/
	
	/* Reset Password validation checks */
	$scope.resetPassword = function () {
		$scope.cleanAlerts();
		if ( $scope.emailForResetPassword ==='' || $scope.emailForResetPassword=== undefined ) {
			$scope.emptyForgotPasswordEmail = "true";
			return;
		}
		if ( $scope.emailForResetPassword !== $scope.user.email) {
			$scope.invalidForgotEmailAlert = "true";
			return;
		}
		$scope.successForgotPasswordEmail = "true";
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
