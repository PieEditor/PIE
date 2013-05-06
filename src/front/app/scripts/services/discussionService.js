/*
	This service is used to store a discussion between multiple controllers.
	Each controller will:
	- get injected the shared instance of the service
	- watch for a change on the discussionService.currentDiscussion
	- on a change, it should update its $scope variable accordingly
*/
angular.module('pie')
.factory('discussionService', function($resource) {
	return {
		currentDiscussion: undefined,
		Discussion: $resource('/api/discussion/:id', {id: '@id'})
	};
});