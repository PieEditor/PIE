'use strict';

angular.module('pie')
.controller('CreateNewDocController', function ($scope, $resource, $routeParams,$location,$timeout) {
	
	$scope.architectureLevels = [
		{text:'First part title...', level:1, deleted:false},
		{text:'SUbFirst part title...', level:2, deleted:false},
		{text:'SubFirst part title...', level:2, deleted:false},
		{text:'Second part title...', level:1, deleted:false},
		{text:'SubSecond part title...', level:2, deleted:false},
		{text:'SubSecond part title...', level:2, deleted:false},
		{text:'SubSubSecond part title...', level:3, deleted:false},
		{text:'SubSubSecond part title...', level:3, deleted:false},
		{text:'Thrid part title...', level:1, deleted:false}
    ];
	$scope.size =  _.size($scope.architectureLevels);
	/* remove a part and all the subparts in it */
	$scope.removePart = function(part) {
		part.deleted = true;
		var index = _.indexOf( $scope.architectureLevels, part) ;
		var deleteSubPartsIsNotDone = true ; 
		while ( deleteSubPartsIsNotDone ) {
			if ( $scope.architectureLevels[index+1].level > part.level ) {
				$scope.architectureLevels[index+1].deleted=true;
				index=index+1;
			} else {
				deleteSubPartsIsNotDone = false;
			}
		}	
		$scope.architectureLevels = _.filter($scope.architectureLevels, function (level) {
			return !level.deleted;
		})   
	};
	
	/* return the level of a part */
	$scope.getPartLevel = function(part) {
		return part.level;
	};
	
	/* Add a sub part where in the selected part */
	$scope.createSubPart = function(part) {
		var index = _.indexOf( $scope.architectureLevels, part) ;
		$scope.architectureLevels.splice(index, 0, {});
		$scope.size =  _.size($scope.architectureLevels);
	};


});
