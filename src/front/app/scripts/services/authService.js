angular.module('pie')
.factory('authService', function($http, $location, apiBaseUrl) {
	return {
		user: undefined,
		login: function(login, passwd, successCallback, errorCallback) {
			return $http({
				method: "POST",
				url: apiBaseUrl + "/users/signin",
				data: {login:login, passwd:passwd},
				withCredentials: true
			});
		},
		logout: function() {
			return $http({
				method: "POST",
				url: apiBaseUrl + "/user/signout",
				withCredentials: true
			});
		},
		register: function(login, passwd, email, imgUrl) {
			return $http({
				method: "POST",
				url: apiBaseUrl + "/users/signup",
				data: { login:login, passwd:passwd, email:email, imgUrl:imgUrl },
				withCredentials: true
			});
		},
		ensureLogin: function() {
			// Optimistic function : immediately returns by assuming the
			// user is correctly logged in. If not, after server-side check,
			// redirects the user to the login page
			var t = this;

			var p = $http({
				method: "GET",
				url: apiBaseUrl + "/user",
				withCredentials: true
			});
			p.success(function(data) {
				t.user = data;
			});
			p.error(function() {
				$location.path('/login');
			});
			return p;
		}
	};
});