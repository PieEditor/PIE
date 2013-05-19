angular.module('pie').
filter('convertnewlines', function() {
	return function(input) {
		var out = input.replace(/\n/g, '<br />');
		return out;
	};
});