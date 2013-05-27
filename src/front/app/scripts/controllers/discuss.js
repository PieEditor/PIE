'use strict';

angular.module('pie')
.controller('DiscussController', function ($scope, authService, discussionService) {
	authService
	.ensureLogin()
	.then(function() {
		$scope.user = authService.user;
	});

	// Watch for a change on some discussionService properties
	$scope.$watch(
		function() { return discussionService.currentDiscussion; },
		function() { $scope.discussion = discussionService.currentDiscussion; },
		true
	);
	$scope.$watch(
		function() { return discussionService.currentState; },
		function() { $scope.currentState = discussionService.currentState; }
	);

	$scope.now = new Date();

	$scope.addPost = function(resolve) {
		// Form validation
		if (! $scope.newContent) return;

		discussionService.addPost($scope.user, $scope.newContent, resolve);

		// Clear inputs
		$scope.newContent = '';
		$scope.newOwner = '';
	};

	$scope.downvote = function(post) {
		discussionService.downvote(post);
	};

	$scope.upvote = function(post) {
		discussionService.upvote(post);
	};

	$scope.close = function() {
		discussionService.currentDiscussion = undefined;
		discussionService.currentState = 'none';
	};

	$scope.addDiscussion = function() {
		if (! $scope.newTitle || ! $scope.newContent) return;

		$scope.discussion.title = $scope.newTitle;
		$scope.discussion.posts[0].content = $scope.newContent;
		discussionService.save();

		discussionService.currentState = 'show';

		// Clear inputs
		$scope.newTitle = '';
		$scope.newContent = '';
	};
});