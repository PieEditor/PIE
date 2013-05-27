'use strict';

angular.module('pie')
.controller('architectureController', function ($scope, $routeParams, $location, authService, documentService, tocService ) {
	authService.ensureLogin();

	$scope.$watch(
		function() { return documentService.currentDocument; },
		function() { $scope.document = documentService.currentDocument; }
	);

	if (! $routeParams.documentId) { // create a new document
		documentService.create();
	}
	else { // or fetch an existing one
		documentService.get($routeParams.documentId);
	}

	/* remove a part and all the subparts in it */
	$scope.removePart = function(part) {
		part.deleted = true;
		var index = _.indexOf($scope.document.content, part);
		var deleteSubPartsIsNotDone = true ; 
		var size = $scope.document.content.length;

		while (deleteSubPartsIsNotDone) {
			if (index+1 < size && $scope.document.content[index+1].level > part.level) {
				$scope.document.content[index+1].deleted = true;
				index = index+1;
			} else {
				deleteSubPartsIsNotDone = false;
			}
		}

		$scope.document.content = _.filter($scope.document.content, function (level) {
			return !level.deleted;
		});
	};
	
	/* return the text of a part */
	$scope.getPartIndice = function(part, architectureLevels) {
		return tocService.getPartIndice(part, architectureLevels ) ;
	};
	
	/* Add a sub part in the selected part */
	$scope.createSubPart = function(part) {
		var index = _.indexOf($scope.document.content, part) ;
		var myNewLevel = $scope.document.content[index].level + 1;
		$scope.document.content.splice(index+1, 0, {title : '' , level : myNewLevel , deleted : false});
	};
	
	/* Add a part of the same level under the selected part */
	$scope.createNewPart = function(part) {
		var index = _.indexOf($scope.document.content, part) ;
		var myNewLevel = $scope.document.content[index].level ;
		$scope.document.content.splice(index+1, 0, {title : '' , level : myNewLevel , deleted : false});
	};

	/* push backward an section of the architecture */
	$scope.stepBackward = function(part) {
		var index = _.indexOf( $scope.document.content, part) ;
		if ($scope.document.content[index].level !== 1) {
			$scope.document.content[index].level = $scope.document.content[index].level-1;
		}
	};

	/* push forward an section of the architecture */
	$scope.stepForward = function(part) {
		var index = _.indexOf( $scope.document.content, part) ;
		if (index > 0 && ($scope.document.content[index].level - $scope.document.content[index-1].level) <1 ) {
			$scope.document.content[index].level = $scope.document.content[index].level+1;
		}	
	};
	
	/* Hide the remove button if only one item left */
	$scope.removeButtonHide = function(part, architectureLevels) {
		if (part.level === 1) {
			architectureLevels = _.filter(architectureLevels, function (section) {
				return section.level === 1;
			});
			if (architectureLevels.length === 1) {
				return true;
			}
		}
		return false;
	};
	
	/* Hide the backward button if the level of the section is 1 */
	$scope.backwardButtonHide = function(part) {
		if (part.level === 1) {
			return true;
		}
		return false;
	};
	
	/* Hide the forward button if the level of the previous section is already smaller */
	$scope.forwardButtonHide = function(part, architectureLevels) {
		var index = _.indexOf( $scope.document.content, part);
		if (index === 0 || ($scope.document.content[index].level - $scope.document.content[index-1].level) >=1) {
			return true;
		}
		return false;
	};
	
	$scope.addCollaborator = function() {
		if (! $scope.newCollaborator) return;
		
		$scope.document.collaborators.push({
			login: $scope.newCollaborator,
			imgUrl: undefined
		});
		$scope.newCollaborator = '';
	};
	
	$scope.removeCollaborator = function(collaborator) {
		var index = _.indexOf($scope.document.collaborators, collaborator);
		$scope.document.collaborators.splice(index, 1);
	};
	
	$scope.sendArchitecture = function () {
		if (! $routeParams.documentId ) {
			$scope.document.owner = authService.user.login;
			
			documentService.post()
			.success(function(docId) {
				$location.path('/editAndDiscuss/' + JSON.parse(docId));
			})
			.error(function(data) {
				console.log(data);
			});
		} else {
			documentService.update()
			.success(function() {
				$location.path('/editAndDiscuss/'+$routeParams.documentId);
			})
			.error(function(data) {
				console.log('error');
			});			
		}
	};
});
