'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $routeParams, authService, documentService, discussionService ) {
	authService.ensureLogin();

	$scope.$watch(
		function() { return documentService.currentDocument; },
		function() {
			$scope.document = documentService.currentDocument;

			if(! $scope.document) return;
			
			_.map($scope.document.content, function(c) {
				// If we have some content, then show it (isMyContentEditable = false)
				// If we don't, show the editing field (isMyContentEditable = true)
				c.isMyContentEditable = ! c.content;
			});
		}
	);

	documentService.get($routeParams.documentId);

	$scope.edit = function(section) {
		if (! section.isMyContentEditable) {
			section.isMyContentEditable = true;
		}
		else {
			section.isMyContentEditable = ! section.content;
			documentService.update();
		}
	};

	$scope.showDiscussion = function(discussion) {
		discussionService.get(discussion.id);
	};

	$scope.createDiscussion = function(section) {
		discussionService.currentState = 'new';
	};
});
