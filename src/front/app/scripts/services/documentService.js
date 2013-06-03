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
			if (this.currentLastVersion === undefined) return;

			var url = apiBaseUrl + '/documents/' + this.currentDocument.docId;
			if (this.currentDocument.version != this.currentLastVersion)
				url += '/versions/' + this.currentDocument.version;

			return url;
		},
		newIteration: function() {
			var t = this;

			// Prepare the new iteration of the document
			delete t.currentDocument._id;
			delete t.currentDocument._rev;
			_.each(t.currentDocument.content, function(elem) {
				for (var i = 0 ; i < elem.discussions.length ; i++)
					if (elem.discussions[i].resolved)
						elem.discussions.splice(i, 1);
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
