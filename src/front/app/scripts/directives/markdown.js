angular.module('pie')
.directive('piemarkdown', function() {
	var converter = new Showdown.converter();

	return {
		restrict: 'E',
		scope: { content: '=' },
		link: function(scope, element, attrs) {
			scope.$watch('content', function(newVal) {
				if (newVal) {
					element.html(converter.makeHtml(newVal));
				}
			});
		}
	};
});