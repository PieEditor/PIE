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
			$scope.user = newVal;
			$scope.login = authService.user.login;
			$scope.numberOfNotification = authService.user.notifications.length;
			$scope.notifications = authService.user.notifications;
			var i =0 ;
			for ( i =0 ; i< $scope.numberOfNotification ; i++ ) {
				if ( $scope.notifications[i].type === "document" ) {
					$scope.notifications[i].path = "/#/editAndDiscuss/"+$scope.notifications[i].id;
				} else if ($scope.notifications[i].type === "discussion" ){
					$scope.notifications[i].path = "/#/editAndDiscuss/"+$scope.notifications[i].id+"";
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
