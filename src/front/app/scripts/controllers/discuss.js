'use strict';

angular.module('pie')
.controller('DiscussController', function ($scope, $location, $anchorScroll, authService, documentService, discussionService, permissionService, tocService) {
	authService
	.ensureLogin()
	.then(function() {
		$scope.user = {
			login: authService.user.login,
			imgUrl: authService.user.imgUrl
		};
	});

	discussionService.currentState = 'none';
	
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

	$scope.$watch(
		function() { return documentService.currentDocument; },
		function() {
			if (! documentService.currentDocument) return;
			$scope.allDiscussions = [];
			$scope.document = documentService.currentDocument;
			_.map(_.pluck(documentService.currentDocument.content, 'discussions'), function(discussions) {
				if (_.isEmpty(discussions)) return;
				_.map(discussions, function(discussion) {
					$scope.allDiscussions.push(discussion);
				});
			});
		},
		true
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

	$scope.iCanCloseCurrentDiscussion = permissionService.iCanCloseCurrentDiscussion;

	$scope.discussionIcon = function(discussion) {
		return discussion.resolved ? 'icon-ok': '';
	};
	
	$scope.getPartIndice = function( part , docContent ) {
		return tocService.getPartIndice (part , docContent ) ;
	};
	
	$scope.goto = function(section) {
		// HACK
		// See: http://stackoverflow.com/questions/14712223/how-to-handle-anchor-hash-linking-in-angularjs
		var a = $location.hash();
		$location.hash(section.title);
		$anchorScroll();
		$location.hash(a);
	};

	$scope.showDiscussion = function(discussion) {
		discussionService.show(discussion);
	};
});
