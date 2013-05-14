'use strict';

angular.module('pie')
.controller('CreateNewDocController', function ($scope, $resource, $routeParams,$location,$timeout) {
	
	$scope.architectureLevels = [
		{text:'First section title...', level:1, deleted:false},
		{text:'Sub First section title...', level:2, deleted:false},
		{text:'Sub First section title...', level:2, deleted:false},
		{text:'Sub First section title...', level:3, deleted:false},
		{text:'Sub First section title...', level:2, deleted:false},
		{text:'Second section title...', level:1, deleted:false},
		{text:'Sub Second section title...', level:2, deleted:false},
		{text:'Sub Second section title...', level:2, deleted:false},
		{text:'Third section title...', level:1, deleted:false},
		{text:'Sub third section title...', level:2, deleted:false},
		{text:'Sub third section title...', level:2, deleted:false},
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

	/* return the text of a part */
	$scope.getPartIndice = function(part,architectureLevels) {
		var i = 1;
		var j = 0 ;
		var indice="";
		var myIndex = _.indexOf( architectureLevels, part)  ;
		var myLevel =  architectureLevels[myIndex].level ;
		for ( i=1; i<= myLevel; i++ ) {
			var count = 0 ;		
			for (j=0;j<=myIndex;j++) {
				if (j < $scope.size-1 && j!==myIndex && architectureLevels[j+1].level < i ) {
					count = 0;
				} else if  (j < $scope.size && architectureLevels[j].level == i) {
					count++;
				}
			}
			
			indice += count + '.';
		}
		return indice; 
	};
	
	/* Add a sub part in the selected part */
	$scope.createSubPart = function(part) {
		var index = _.indexOf( $scope.architectureLevels, part) ;
		var myNewLevel =  $scope.architectureLevels[index].level + 1;
		$scope.architectureLevels.splice(index+1, 0, { text : 'New sub section title...' , level : myNewLevel , deleted : false });
		$scope.size =  _.size($scope.architectureLevels);
	};
	
	/* Add a part of the same level under the selected part */
	$scope.createNewPart = function(part) {
		var index = _.indexOf( $scope.architectureLevels, part) ;
		var myNewLevel =  $scope.architectureLevels[index].level ;
		$scope.architectureLevels.splice(index+1, 0, { text : 'New section title...' , level : myNewLevel , deleted : false });
		$scope.size =  _.size($scope.architectureLevels);
	};


});
