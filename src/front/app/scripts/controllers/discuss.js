'use strict';

angular.module('pie')
.controller('DiscussController', function ($scope, $resource, $routeParams) {
	var Discussion = $resource('/api/discussion/:id', {id: '@id'});
	$scope.discussion = Discussion.get($routeParams.discussionId);

	var User = $resource('/api/user/:id', {id: '@id'});
	$scope.user = User.get({id: 1});

	$scope.now = new Date();

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
		$scope.discussion.$save(); // POST data to server 

		// Clear inputs
		$scope.newContent = '';
		$scope.newOwner = '';
	};

	$scope.downvote = function(post) {
		post.score--;
	};

	$scope.upvote = function(post) {
		post.score++;
	};

});