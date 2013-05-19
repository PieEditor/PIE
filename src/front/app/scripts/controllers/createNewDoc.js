'use strict';

angular.module('pie')
.controller('CreateNewDocController', function ($scope, $http, $resource, $routeParams, $location, $timeout, authService, apiBaseUrl) {
	var myToken = authService.ensureLoginAndReturnToken();
	$scope.architectureLevels = [
		{title:'', level:1},
		{title:'', level:1},
		{title:'', level:1}
	];

	/* remove a part and all the subparts in it */
	$scope.removePart = function(part) {
		part.deleted = true;
		var index = _.indexOf($scope.architectureLevels, part);
		var deleteSubPartsIsNotDone = true ; 
		var size = $scope.architectureLevels.length;

		while (deleteSubPartsIsNotDone) {
			if (index+1 < size && $scope.architectureLevels[index+1].level > part.level) {
				$scope.architectureLevels[index+1].deleted = true;
				index = index+1;
			} else {
				deleteSubPartsIsNotDone = false;
			}
		}

		$scope.architectureLevels = _.filter($scope.architectureLevels, function (level) {
			return !level.deleted;
		});
	};
	
	/* return the text of a part */
	$scope.getPartIndice = function(part, architectureLevels) {
		var i = 1;
		var j = 0;
		var indice = "";
		var myIndex = _.indexOf( architectureLevels, part);
		var myLevel =  architectureLevels[myIndex].level;
		var size = architectureLevels.length;

		for (i = 1; i <= myLevel; i++) {
			var count = 0;
			for (j = 0 ; j <= myIndex ; j++) {
				if (j < size-1 && j !== myIndex && architectureLevels[j+1].level < i) {
					count = 0;
				} else if  (j < size && architectureLevels[j].level == i) {
					count++;
				}
			}
			
			indice += count + '.';
		}
		return indice; 
	};
	
	/* Add a sub part in the selected part */
	$scope.createSubPart = function(part) {
		var index = _.indexOf($scope.architectureLevels, part) ;
		var myNewLevel = $scope.architectureLevels[index].level + 1;
		$scope.architectureLevels.splice(index+1, 0, {title : '' , level : myNewLevel , deleted : false});
	};
	
	/* Add a part of the same level under the selected part */
	$scope.createNewPart = function(part) {
		var index = _.indexOf($scope.architectureLevels, part) ;
		var myNewLevel = $scope.architectureLevels[index].level ;
		$scope.architectureLevels.splice(index+1, 0, {title : '' , level : myNewLevel , deleted : false});
	};

	/* push backward an section of the architecture */
	$scope.stepBackward = function(part) {
		var index = _.indexOf( $scope.architectureLevels, part) ;
		if ($scope.architectureLevels[index].level !== 1) {
			$scope.architectureLevels[index].level = $scope.architectureLevels[index].level-1;
		}
	};

	/* push forward an section of the architecture */
	$scope.stepForward = function(part) {
		var index = _.indexOf( $scope.architectureLevels, part) ;
		if (index > 0 && ($scope.architectureLevels[index].level - $scope.architectureLevels[index-1].level) <1 ) {
			$scope.architectureLevels[index].level = $scope.architectureLevels[index].level+1;
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
		var index = _.indexOf( $scope.architectureLevels, part);
		if (index === 0 || ($scope.architectureLevels[index].level - $scope.architectureLevels[index-1].level) >=1) {
			return true;
		}
		return false;
	};
	
	$scope.sendArchitecture = function () {
		var myDocument = {
			title: $scope.documentTitle,
			owner : authService.username,
			content: $scope.architectureLevels
		};

		$http.post(apiBaseUrl + '/documents?token=' + myToken, myDocument)
		.success(function(docId) {
			$location.path('/editAndDiscuss/'+JSON.parse(docId));
		})
		.error(function(data) {
			console.log('error');
		});
	};
});