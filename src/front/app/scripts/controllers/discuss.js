'use strict';

angular.module('pie')
.controller('DiscussController', function ($scope) {
	// Default data, should be populated later by an AJAX call
	$scope.discussion = {
		title: 'Our first discussion',
		posts: [
			{
				owner: {
					name: 'Fabio Guigou',
					img: '/images/zooportraits/fox.jpg'
				},
				content: 'Coucou, 1er post ici',
				date: new Date(2013, 2, 2),
				score: 10
			},
			{
				owner: {
					name: 'Baptiste Metge',
					img: '/images/zooportraits/llama.jpg'
				},
				content: 'Coucou, 2eme post ici',
				date: new Date(2013, 2, 3),
				score: -1
			}
		]
	};

	$scope.user = {
		name: 'Paul Mougel',
		img: '/images/zooportraits/giraffe.jpg'
	};

	$scope.now = new Date();

	$scope.addPost = function() {
		// Form validation
		if ($scope.newContent === '' || $scope.newContent === undefined) {
			return;
		}

		// Add the new post to the model
		var newPost = {
			owner: $scope.user,
			content: $scope.newContent,
			date: new Date(),
			score: 0
		};
		$scope.discussion.posts.push(newPost);

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