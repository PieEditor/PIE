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
		documentService.update()
		.success(function() {
			documentService.newVersion();
			documentService.post().success(function(_id) {
				location.reload();
	//			$location.path('/editAndDiscuss/' + documentService.currentDocument.docId);
			})
			.error(function(data) {
				console.log(data);
			});
		})
		.error(function(error) {
			console.log(error);
		});	
		discussionService.currentState = "none";
		discussionService.currentDiscussion = undefined;
	};
	
	$scope.getPartIndice = function( part , docContent ) {
		return tocService.getPartIndice (part , docContent ) ;
	};
});

