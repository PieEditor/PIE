angular.module('pie')
.factory('documentService', function($http, apiBaseUrl) {
	return {
		currentDocument: undefined,
		get: function(id) {
			var t = this;
			var p = $http({
				method: "GET",
				url: apiBaseUrl + "/documents/" + id,
				withCredentials: true
			});
			p.success(function(data) {
				t.currentDocument = data;
			});
			return p;
		},
		post: function() {
			var p = $http({
				method: "POST",
				url: apiBaseUrl + "/documents",
				data : this.currentDocument,
				withCredentials: true
			});
			return p;
		},
		update: function() {
			var p = $http({
				method: "PUT",
				url: apiBaseUrl + "/documents/" + this.currentDocument._id,
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
		downloadUrl: function(id) {
			return apiBaseUrl + '/documents/' + id + '.pdf';
		},
		newVersion: function() {
			console.log(' new version ');
			delete this.currentDocument._id;
			delete this.currentDocument._rev;
			_.each(this.currentDocument.content, function(elem) {
				elem.discussions = [];
			});
		}
	};
});
