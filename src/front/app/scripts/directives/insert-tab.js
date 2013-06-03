angular.module('pie')
.directive('insertTab', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).keydown(function(e) {
				if (e.keyCode != 9) return;

				var caretPosition = element[0].selectionStart;
				var initialValue = element[0].value;
				element[0].value = 
					initialValue.substring(0, caretPosition) +
					'\t' +
					initialValue.substring(caretPosition, initialValue.length)
				;
				element[0].selectionStart = caretPosition + 1;
				element[0].selectionEnd = caretPosition + 1;
				e.preventDefault();
			});
		}
	};
});