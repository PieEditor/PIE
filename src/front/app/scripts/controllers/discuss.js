'use strict';

angular.module('pie')
.controller('DiscussController', function ($scope, $http, $routeParams, apiBaseUrl, discussionService) {
	// Initialize the discussion with the ID coming from the URL
	if ($routeParams.discussionId !== undefined) {
		discussionService.get($routeParams.discussionId);
	}

	$http({method: 'GET', url: apiBaseUrl + '/user', withCredentials: true})
	.success(function(data) {
		$scope.user = data;
	});

	// Watch for a change on some discussionService properties
	$scope.$watch(
		function() { return discussionService.currentDiscussion; },
		function() { $scope.discussion = discussionService.currentDiscussion; }
	);
	$scope.$watch(
		function() { return discussionService.currentState; },
		function() { $scope.currentState = discussionService.currentState; }
	);

	$scope.now = new Date();

	$scope.addPost = function() {
		// Form validation
		if (! $scope.newContent) return;

		var newPost = {
			owner: $scope.user,
			content: $scope.newContent,
			date: new Date(),
			score: 0
		};
		$scope.discussion.posts.push(newPost); // Update model
		$scope.discussion.$save($scope.discussion.id); // POST data to server 

		// Clear inputs
		$scope.newContent = '';
		$scope.newOwner = '';
	};

	$scope.downvote = function(post) {
		post.score--;
		$scope.discussion.$save($scope.discussion.id);
	};

	$scope.upvote = function(post) {
		post.score++;
		$scope.discussion.$save($scope.discussion.id);
	};

	$scope.close = function() {
		discussionService.currentDiscussion = undefined;
		discussionService.currentState = 'none';
	};

	$scope.addDiscussion = function() {
		if (! $scope.newTitle || ! $scope.newContent) return;

		// TODO: Save discussion

		// Clear inputs
		$scope.newTitle = '';
		$scope.newContent = '';
	};
});