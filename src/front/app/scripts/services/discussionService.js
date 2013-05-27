/*
	This service is used to store a discussion between multiple controllers.
	Each controller will:
	- get injected the shared instance of the service
	- watch for a change on the discussionService.currentDiscussion
	- on a change, it should update its $scope variable accordingly
*/
angular.module('pie')
.factory('discussionService', function($resource, documentService) {
	return {
		currentState: 'none',
		currentDiscussion: undefined,
		create: function(section, owner) {
			this.currentState = 'new';

			var newDiscussion = {
				title: '',
				posts: [
					{
						owner: owner,
						content: '',
						date: new Date(),
						score: 0
					}
				]
			};
			
			if (! section.discussions)
				section.discussions = [];
			
			section.discussions.push(newDiscussion);
			this.currentDiscussion = newDiscussion;
		},
		show: function(discussion) {
			this.currentState = 'show';
			this.currentDiscussion = discussion;
		},
		save: function() {
			documentService.update();
		},
		addPost: function(owner, content) {
			var newPost = {
				owner: owner,
				content: content,
				date: new Date(),
				score: 0
			};
			this.currentDiscussion.posts.push(newPost);
			this.save();
		},
		upvote: function(post) {
			post.score++;
			this.save();
		},
		downvote: function(post) {
			post.score--;
			this.save();
		}
	};
});