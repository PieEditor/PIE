angular.module('pie')
.factory('permissionService', function($injector, $http, apiBaseUrl, authService) {
	return {
		iCanCloseCurrentDiscussion: function() {
			// HACK: Resolve circular dependency via manual injection
			var documentService = $injector.get('documentService');
			var discussionService = $injector.get('discussionService');

			var currentUser = authService.user.login;
			var documentOwner = documentService.currentDocument.owner;
			var sectionOwner;

			_.map(documentService.currentDocument.content, function(section) {
				_.map(section.discussions, function(discussion) {
					if (! section.owner) return;
					if (discussion == discussionService.currentDiscussion)
						sectionOwner = section.owner.login;
				});
			});

			return (currentUser == documentOwner || currentUser == sectionOwner);
		}
	};
});
