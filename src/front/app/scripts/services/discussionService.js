/*
	This service is used to store a discussion between multiple controllers.
	Each controller will:
	- get injected the shared instance of the service
	- watch for a change on the discussionService.currentDiscussion
	- on a change, it should update its $scope variable accordingly
*/
angular.module('pie')
.factory('discussionService', function($resource) {
	var Discussion = $resource('/mockAPI/discussion/:id', {id: '@id'});
	return {
		currentState: 'none',
		currentDiscussion: undefined,
		get: function(id) {
			this.currentDiscussion = Discussion.get({id: id});
		},
		newDiscussion: function(section) {
			this.currentState = 'new';
			
			var newDiscussion = {
				title: $scope.newTitle,
				posts: [
					{
						owner: { login: $scope.user.login, imgUrl: $scope.user.imgUrl },
						content: $scope.newContent,
						date: $scope.now,
						score: 0
					}
				]
			};
			
			if (! section.discussions)
				section.discussions = [];
			
			section.discussions.push(newDiscussion);
			this.currentDiscussion = newDiscussion;
		}
	};
});