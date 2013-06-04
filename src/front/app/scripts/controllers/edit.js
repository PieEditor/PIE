'use strict';

angular.module('pie')
.controller('EditController', function ($scope, $routeParams,$location, authService, documentService, discussionService , tocService) {
	authService
	.ensureLogin()
	.then(function() {
		$scope.user = {
			login: authService.user.login,
			imgUrl: authService.user.imgUrl
		};
	});

	// Watch for current document changes
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

			$scope.downloadUrl = documentService.downloadUrl();

			if ($routeParams.discussionIndex !== undefined) {
				var discussion = undefined;

				var i = 0;
				for (var sectionIndex = 0 ; sectionIndex < documentService.currentDocument.content.length ; sectionIndex++) {
					for (var j = 0 ; j < documentService.currentDocument.content[sectionIndex].discussions.length ; j++) {
						if (i == $routeParams.discussionIndex) {
							discussion = documentService.currentDocument.content[sectionIndex].discussions[j];
						}
						i++;
					}
				}

				if (discussion !== undefined) {
					discussionService.currentState = 'show';
					discussionService.show(discussion);
				}
			}
		}
	);
	documentService.get($routeParams.documentId);

	// Watch for changes on document's last version 
	$scope.$watch(
		function() { return documentService.currentLastVersion; },
		function() {
			$scope.lastVersion = documentService.currentLastVersion;
			if ($scope.lastVersion === undefined) return;
			$scope.range = _.range( $scope.lastVersion , -1 , -1 ) ;
		}
	);

	$scope.edit = function(section) {
		if ( $scope.document.version !== $scope.lastVersion ) {
			section.isMyContentEditable = false ;
		} else if (! section.isMyContentEditable) {
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
	
	$scope.newIteration = function () {
		documentService.newIteration();
		discussionService.currentState = "none";
		discussionService.currentDiscussion = undefined;
	};
	
	$scope.getPartIndice = function( part , docContent ) {
		return tocService.getPartIndice (part , docContent ) ;
	};
	
	$scope.getDocumentVersion = function ( version ) {
		documentService.get($routeParams.documentId, version) 
		.success(function(data) { 
			documentService.currentDocument = data;
		});

		discussionService.currentDiscussion = undefined;
		discussionService.currentState = 'none';
	};
});

