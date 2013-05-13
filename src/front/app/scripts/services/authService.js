/*
	This service is used to store a login token between multiple controllers.
	Each controller will:
	- get injected the shared instance of the service
	- watch for a change on the userService.currentUser
	- on a change, it should update its $scope variable accordingly
*/
angular.module('pie')
.factory('authService', function($http) {
	return {
		token: undefined,
		authenticated: false,
		login: function(login, passwd, successCallback, errorCallback) {
			var t = this;

			$http.post('http://localhost:8080/users/signin', {login:login, passwd:passwd})
			.success(function(data) {
				t.authenticated = true;
				t.token = data.token;
				successCallback();
			})
			.error(function(data) {
				t.authenticated = false;
				t.token = undefined;
				errorCallback();
			});
		},
		register: function(login, passwd, email, imgUrl, successCallback, errorCallback) {
			var t = this;

			$http.post('http://localhost:8080/users/signup', {login:login, passwd:passwd, email:email, imgUrl:imgUrl})
			.success(function(data) {
				t.authenticated = true;
				t.token = data.token;
				successCallback();
			})
			.error(function(data) {
				t.authenticated = false;
				t.token = undefined;
				errorCallback();
			});
		}
	};
});