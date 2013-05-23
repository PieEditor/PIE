// https://gist.github.com/eliotsykes/5394631
// Use ngc-blur in HTML
// Note: We use a custom directive name, as ng-blur will be implemented later
// by the core Angular team

angular.module('pie')
.directive('ngcFocus', ['$parse', function($parse) {
	return function(scope, element, attr) {
		var fn = $parse(attr['ngcFocus']);
		element.bind('focus', function(event) {
			scope.$apply(function() {
				fn(scope, {$event:event});
			});
		});
	};
}])
.directive('ngcBlur', ['$parse', function($parse) {
	return function(scope, element, attr) {
		var fn = $parse(attr['ngcBlur']);
		element.bind('blur', function(event) {
			scope.$apply(function() {
				fn(scope, {$event:event});
			});
		});
	};
}]);