angular.module('pie')
.factory('tocService', function($http, apiBaseUrl) {
	return {
		getPartIndice : function(part, architectureLevels) {
			var i = 1;
			var j = 0;
			var indice = "";
			var myIndex = _.indexOf( architectureLevels, part);
			var myLevel =  architectureLevels[myIndex].level;
			var size = architectureLevels.length;
			for (i = 1; i <= myLevel; i++) {
				var count = 0;
				for (j = 0 ; j <= myIndex ; j++) {
					if (j < size-1 && j !== myIndex && architectureLevels[j+1].level < i) {
						count = 0;
					} else if  (j < size && architectureLevels[j].level == i) {
						count++;
					}
				}
				indice += count + '.';
			}
			return indice; 
		}
	};
});
	
	
