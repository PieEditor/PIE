'use strict';

angular.module('pie')
.controller('LoginController', function ($scope, $resource, $routeParams, $location, $timeout, authService) {
	
	/******************************************/
	/** Initialisation and general functions **/
	/******************************************/

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
		$scope.registrationPasswordDontMatchAlert = "none";	
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
		authService.login(
			$scope.userName,
			$scope.password,
			function() { // success callback
				$location.path('/profilePage/' + $scope.userName);
			},
			function() { // error callback
				$scope.loginFailureAlert = "true";
			}
		);
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
		authService.register($scope.newUserName, $scope.newPassword, $scope.newEmail, $scope.newImage,
			function() { // success callback
				$scope.registrationSucessAlert = "true";
				$timeout(
					function () {
						$location.path('/login/');
					},
					1500
				);
			},
			function() { // error callback
			}
		);
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


angular.module('pie')
.controller('forgotPasswordModalCtrl', function ($scope, $resource, $routeParams) {

  $scope.open = function () {
    $scope.forgotpasswordModal = true;
  };

  $scope.close = function () {
    $scope.closeMsg = 'I was closed at: ' + new Date();
    $scope.forgotpasswordModal = false;
  };

  $scope.opts = {
    backdropFade: true,
    dialogFade:true
  };

});
