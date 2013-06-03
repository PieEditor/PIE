angular.module('pie')
.factory('authService', function($http, $location, apiBaseUrl) {
	var socketIOConnection = null;
	return {
		user: undefined,
		login: function(login, passwd) {
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
				data: { login:login, passwd:passwd, email:email, imgUrl:imgUrl, notifications : [] },
				withCredentials: true
			});
		},
		update: function() {
			return $http({
				method: "PUT",
				url: apiBaseUrl + "/user",
				data : this.user,
				withCredentials: true
			});
		},
		ensureLogin: function() {
			console.log("Entering method");
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
				if (socketIOConnection === null) {
				console.log("Creating connection");
				socketIOConnection = io.connect(apiBaseUrl);
				socketIOConnection.on('notification', function(data) {
					t.user.notifications.push(data);
					console.log(data);
				});
				socketIOConnection.emit('login', {'login':t.user.login});
			}
			});
			p.error(function() {
				$location.path('/login');
			});
			return p;
		}
	};
});
