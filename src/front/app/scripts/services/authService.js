/*
	This service is used to store a login token between multiple controllers.
	Each controller will:
	- get injected the shared instance of the service
	- watch for a change on the userService.currentUser
	- on a change, it should update its $scope variable accordingly
*/
angular.module('pie')
.factory('authService', function($http, $cookieStore, $location) {
	return {
		username: undefined,
		login: function(login, passwd, successCallback, errorCallback) {
			var t = this;
			$cookieStore.put('token', undefined);

			$http.post('http://localhost:8080/users/signin', {login:login, passwd:passwd})
			.success(function(data) {
				$cookieStore.put('token', JSON.parse(data));
				successCallback();
			})
			.error(function(data) {
				errorCallback();
			});
		},
		logout: function(successCallback, errorCallback) {
			$http.post('http://localhost:8080/user/signout', {token: $cookieStore.get('token')})
			.success(successCallback)
			.error(errorCallback);
		},
		register: function(login, passwd, email, imgUrl, successCallback, errorCallback) {
			var t = this;
			$cookieStore.put('token', undefined);

			var u = {login:login, passwd:passwd, email:email, imgUrl:imgUrl};
			$http.post('http://localhost:8080/users/signup', {user: u})
			.success(function(data) {
				$cookieStore.put('token', JSON.parse(data));
				successCallback();
			})
			.error(function(data) {
				errorCallback();
			});
		},
		ensureLoginAndReturnToken: function() {
			// Optimistic function : returns the existing token
			// assuming it is correct.
			// If not, after server-side check, redirects the user to
			// the login page
			var t = this;
			$http.get('http://localhost:8080/tokens/' + $cookieStore.get('token'))
			.success(function(data) {
				t.username = JSON.parse(data);
			})
			.error(function() {
				$cookieStore.remove('token');
				$location.path('/login');
			});

			return $cookieStore.get('token');
		}
	};
});