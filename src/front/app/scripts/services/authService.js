angular.module('pie')
.factory('authService', function($http, $cookieStore, $location, apiBaseUrl) {
	return {
		username: undefined,
		login: function(login, passwd, successCallback, errorCallback) {
			var t = this;

			$http.post(apiBaseUrl + '/users/signin', {login:login, passwd:passwd})
			.success(successCallback)
			.error(errorCallback);
		},
		logout: function(successCallback, errorCallback) {
			$http.post(apiBaseUrl + '/user/signout')
			.success(successCallback)
			.error(errorCallback);
		},
		register: function(login, passwd, email, imgUrl, successCallback, errorCallback) {
			var t = this;
			var user = {login:login, passwd:passwd, email:email, imgUrl:imgUrl};
			$http.post(apiBaseUrl + '/users/signup', user)
			.success(successCallback)
			.error(errorCallback);
		},
		ensureLogin: function() {
			// Optimistic function : immediately returns by assuming the
			// user is correctly logged in. If not, after server-side check,
			// redirects the user to the login page
			var t = this;

			$http.get(apiBaseUrl + '/token')
			.success(function(data) {
				t.username = JSON.parse(data);
			})
			.error(function() {
				$location.path('/login');
			});
		}
	};
});