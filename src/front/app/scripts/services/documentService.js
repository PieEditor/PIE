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
				content: [
					{ title: '', level: 1},
					{ title: '', level: 1},
					{ title: '', level: 1}
				]
			};
		},
		downloadUrl: function(id) {
			return apiBaseUrl + '/documents/' + id + '.pdf';
		}
	};
});