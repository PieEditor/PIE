'use strict';

angular.module('pie')
.controller('DiscussController', function ($scope, $resource, $routeParams, discussionService) {
	if ($routeParams.discussionId !== undefined) {
		// Initialize the discussion with the ID coming from the URL
		discussionService.get($routeParams.discussionId);
	}

	// Watch for a change on the discussion shared via the discussionService
	$scope.$watch(
		function() { return discussionService.currentDiscussion; },
		function() {
			// If the discussion shared via the service has changed
			// update our scope accordingly
			$scope.discussion = discussionService.currentDiscussion;
		}
	);

	var User = $resource('/api/user/:id', {id: '@id'});
	$scope.user = User.get({id: 1});

	$scope.now = new Date();

	$scope.close = function() {
		discussionService.currentDiscussion = undefined;
	};

	$scope.addPost = function() {
		// Form validation
		if ($scope.newContent === '' || $scope.newContent === undefined) {
			return;
		}

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

});