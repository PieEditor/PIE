angular.module('pie')
.factory('documentService', function($http, apiBaseUrl) {
	return {
		currentDocument: undefined,
		currentLastVersion: undefined,
		get: function(docId, version) { // version number is optionnal
			var t = this;

			var url = '/documents/' + docId;
			if (version !== undefined)
				url += '/versions/' + version;

			// Get the document
			var p = $http({
				method: 'GET',
				url: apiBaseUrl + url,
				withCredentials: true
			});
			p.success(function(data) {
				t.currentDocument = data;
			});

			// Get the number of versions of the document
			$http({
				method: 'GET',
				url: apiBaseUrl + '/documents/' + docId + '/versions',
				withCredentials: true
			})
			.success(function(data) {
				t.currentLastVersion = data.lastVersion;
			});

			return p;
		},
		post: function() {
			var p = $http({
				method: 'POST',
				url: apiBaseUrl + '/documents',
				data : this.currentDocument,
				withCredentials: true
			});
			return p;
		},
		update: function() {
			var p = $http({
				method: 'PUT',
				url: apiBaseUrl + '/documents/' + this.currentDocument._id,
				data : this.currentDocument,
				withCredentials: true
			});
			return p;
		},
		patch: function(section) {
			var p = $http({
				method: 'PATCH',
				url: apiBaseUrl + '/documents/' + this.currentDocument.docId,
				data : {
					replace: "/content/"+this.currentDocument.content.indexOf(section)+"/content",
					value: section.content
				},
				withCredentials: true
			});
			return p;
		},
		create: function() {
			this.currentDocument = {
				title: '',
				owner : '',
				collaborators : [],
				content: [
					{title: '', level: 1, discussions: [], owner : undefined},
					{title: '', level: 1, discussions: [], owner : undefined},
					{title: '', level: 1, discussions: [], owner : undefined}
				],
				docId: undefined,
				version: undefined
			};
		},
		downloadUrl: function() {
			if (this.currentDocument === undefined) return;
			return apiBaseUrl + '/documents/' + this.currentDocument.docId + '/versions/' + this.currentDocument.version;
		},
		newIteration: function() {
			var t = this;

			// Prepare the new iteration of the document
			delete t.currentDocument._id;
			delete t.currentDocument._rev;
			_.each(t.currentDocument.content, function(elem) {
				if (! elem.discussions)
					elem.discussions = [];
				for (var i = 0 ; i < elem.discussions.length ; i++) {
					if (elem.discussions[i].resolved) {
						var len = elem.discussions[i].posts.length;
						elem.discussions[i].posts.splice(0, len - 1);
					}
				}
			});
			// Save the new iteration
			t.post()
			// Reload the document once the new version is saved
			.success(function() {
				t.get(t.currentDocument.docId);
			});
		}
	};
});
