'use strict';

angular.module('pie')
.controller('TopBarController', function ($scope, authService) {
	$scope.isSectionActive = function(section) {
		return ($scope.currentPage == section) ? 'active' : '';
	};

	$scope.$watch(
		function() { return authService.user; },
		function(newVal) {
			if (! authService.user) return;
			$scope.login = authService.user.login;
			$scope.numberOfNotification = authService.user.notifications.length;
			$scope.notifications = authService.user.notifications;
		}
	);
	$scope.logout = authService.logout;
});
