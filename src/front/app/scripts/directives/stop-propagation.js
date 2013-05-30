angular.module('pie')
.directive('stopPropagation', function() {
	return {
		link: function(scope, element, attrs) {
			$(element).on('click', function(e) {
				e.stopPropagation();
			});
		}
	};
});
