'use strict';

describe('Controller: DiscussController', function () {

	// load the controller's module
	beforeEach(module('pie'));

	var DiscussController, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		DiscussController = $controller('DiscussController', {
			$scope: scope
		});
	}));

	it('should increment a post score when upvoting', function () {
		var newPost = {
			owner: 'Toto',
			content: 'My content',
			date: new Date(),
			score: 0
		};
		scope.upvote(newPost);

		expect(newPost.score).toBe(1);
	});

	it('should decrement a post score when downvoting', function () {
		var newPost = {
			owner: 'Toto',
			content: 'My content',
			date: new Date(),
			score: 0
		};
		scope.downvote(newPost);

		expect(newPost.score).toBe(-1);
	});
});
