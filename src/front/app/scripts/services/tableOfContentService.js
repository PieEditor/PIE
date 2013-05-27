angular.module('pie')
.factory('tableOfContentService', function($resource) {
	var Discussion = $resource('/mockAPI/discussion/:id', {id: '@id'});
	return {
		currentDiscussion: undefined,
		get: function(id) {
			this.currentDiscussion = Discussion.get({id: id});
		}
	};
});
