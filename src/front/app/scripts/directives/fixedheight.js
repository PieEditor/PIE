angular.module('pie')
.directive('fixedheight', function() {
	return {
		compile: function(tElement, tAttrs) {
			function f() {
				$(tElement).css('max-height', $(window).height());
			}
			f();
			$(window).resize(f);
		}
	};
});