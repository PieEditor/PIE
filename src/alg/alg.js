/*
function rank(Rating, No_Response, Score){//Original Version
	
	Rating = Rating + Math.pow( 1 + No_Response / 100 , Score/10 );
	return Rating;

}
*/

/*  Alternative implementation
 *  Expectation of Rating
 *  Resolves the problem of useless posts
 */
function rank(Rating, Cnt, Score){
	
	Total = Rating * Cnt + Math.pow( 10 , Score/10 );
	new_Rating = Total / (Cnt + 1);
	return new_Rating;
	}

function getIndex(value, array){
	for (var i=0;i<array.length;i++){
		if (array[i] == value) return i;
	}
}

function inArray(value, array){
	for (var i=0;i<array.length;i++){
		if (array[i] == value) return true;
	}
	return false;
}

var input = require("./input");//input file: input.json


var Collection = new Array();
var Rating = new Array();
var Count = new Array();

for (var i=0;i<input.content.length;i++){
	for (var j=0;j<input.content[i].discussions.length;j++){
		for (var k=0;k<input.content[i].discussions[j].posts.length;k++){
			if (!inArray(input.content[i].discussions[j].posts[k].owner.login, Collection)){
				Collection.push(input.content[i].discussions[j].posts[k].owner.login);
				Rating.push(0);
				Count.push(0);
			}
			var index = getIndex(input.content[i].discussions[j].posts[k].owner.login, Collection);
			Rating[index] = rank(Rating[index], Count[index], input.content[i].discussions[j].posts[k].score);
			Count[index] = Count[index] + 1;
			//console.log(Rating[index]);
		}
	}
}

for (var i=0;i<Collection.length;i++){
	console.log(Collection[i] + "'s rating is " + Rating[i]);
}