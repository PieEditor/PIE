'use strict';

angular.module('pie')
.controller('TopBarController', function ($scope, authService) {
	authService.ensureLogin();
	$scope.isSectionActive = function(section) {
		return ($scope.currentPage == section) ? 'active' : '';
	};

	$scope.$watch(
		function() { return authService.user; },
		function() {
			if (! authService.user) return;			
			$scope.user = authService.user;

			if (! $scope.user.notifications) return;
			for (var i =0 ; i< $scope.user.notifications.length ; i++) {
				if ($scope.user.notifications[i].type === "document") {
					$scope.user.notifications[i].path = "/#/editAndDiscuss/" + $scope.user.notifications[i].docId;
				} else if ($scope.user.notifications[i].type === "discussion") {
					$scope.user.notifications[i].path = "/#/editAndDiscuss/" + $scope.user.notifications[i].docId + "/" + $scope.user.notifications[i].sectionIndex + '/' + $scope.user.notifications[i].discussionIndex;
				}
			}
		},
		true
	);
	$scope.logout = authService.logout;
	
	$scope.deleteNotification = function (notification) {
		var index = _.indexOf(authService.user.notifications, notification);
		authService.user.notifications.splice(index, 1);
		authService.update();
	};

	$scope.clearNotifications = function() {
		authService.user.notifications = [];
		authService.update();
	};
});