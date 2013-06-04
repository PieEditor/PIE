'use strict';

angular.module('pie')
.controller('TopBarController', function ($scope, authService) {
	authService.ensureLogin();
	$scope.isSectionActive = function(section) {
		return ($scope.currentPage == section) ? 'active' : '';
	};

	$scope.$watch(
		function() { return authService.user; },
		function(newVal) {
			if (! authService.user) return;			
			$scope.user = newVal;
			
			if (! $scope.user.notifications) return;
			for (var i =0 ; i< $scope.user.notifications.length ; i++ ) {
				if ( $scope.user.notifications[i].type === "document" ) {
					$scope.user.notifications[i].path = "/#/editAndDiscuss/"+$scope.user.notifications[i].id;
				} else if ($scope.user.notifications[i].type === "discussion" ){
					$scope.user.notifications[i].path = "/#/editAndDiscuss/"+$scope.user.notifications[i].id+"";
				}
			}
		}
	);
	$scope.logout = authService.logout;
	
	$scope.deleteNotification = function ( notification ) {
		var index = _.indexOf($scope.user.notifications, notification);
		$scope.user.notifications = $scope.user.notifications.splice(index, 1);
		authService.update();
	};
});
