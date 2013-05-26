angular.module('pie')
.factory('documentService', function($http, apiBaseUrl) {
	return {
		get: function(id) {
			var p = $http({
				method: "GET",
				url: apiBaseUrl + "/documents/" + id,
				withCredentials: true
			});
			return p;
		},
		post: function(doc) {
			var p = $http({
				method: "POST",
				url: apiBaseUrl + "/documents",
				data : doc,
				withCredentials: true
			});
			return p;
		},
		update: function(doc) {
			var p = $http({
				method: "PUT",
				url: apiBaseUrl + "/documents/" + doc._id,
				data : doc,
				withCredentials: true
			});
			return p;
		},
		empty: function() {
			return {
				title: '',
				owner : '',
				content: [
					{ title: '', level: 1},
					{ title: '', level: 1},
					{ title: '', level: 1}
				]
			};
		}
	};
});