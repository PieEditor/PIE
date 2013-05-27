'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $routeParams,$location, authService, documentService, discussionService , tocService) {
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
	$scope.downloadUrl = documentService.downloadUrl($routeParams.documentId);

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
		discussionService.show(discussion);
	};

	$scope.createDiscussion = function(section) {
		var discussionOwner = {
			login: authService.user.login,
			imgUrl: authService.user.imgUrl
		};
		discussionService.create(section, discussionOwner);
	};
	
	$scope.saveAndRefresh = function ( ) {
		documentService.update();
		documentService.newVersion();
		documentService.post().success(function(docId) {
				$location.path('/editAndDiscuss/' + JSON.parse(docId));
			})
			.error(function(data) {
				console.log(data);
			});
	};
	
	$scope.getPartIndice = function( part , docContent ) {
		return tocService.getPartIndice (part , docContent ) ;
	};
});
