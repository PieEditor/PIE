angular.module('pie').directive('contenteditable', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
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
 
			// load init value from controller
			ctrl.$render();
		}
	};
});