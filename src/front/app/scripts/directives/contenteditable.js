angular.module('pie').directive('contenteditable', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			scope.$watch('section.content', function() {
				ctrl.$render(scope.section.content);
			});

			// view -> model
			elm.bind('blur', function() {
				scope.$apply(function() {
					ctrl.$setViewValue(elm.text());
				});
			});

			// model -> view
			ctrl.$render = function(value) {
				elm.html(value);
			};
		}
	};
});