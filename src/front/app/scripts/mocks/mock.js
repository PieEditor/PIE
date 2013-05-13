'use strict';

// All HTTP requests will go through this server
// which will answer with mock data
angular.module('pie')
.run(function($httpBackend) {
	// Fake data
	var discussion1 = {
		id: 1,
		title: 'Our first discussion',
		posts: [
			{
				owner: {
					name: 'Fabio Guigou',
					img: 'resources/zooportraits/fox.jpg'
				},
				content: 'Hi, 1st post here',
				date: new Date(2013, 2, 2),
				score: 10
			},
			{
				owner: {
					name: 'Baptiste Metge',
					img: 'resources/zooportraits/llama.jpg'
				},
				content: 'Greetings, here is my second post!',
				date: new Date(2013, 2, 3),
				score: -1
			}
		]
	};

	var discussion2 = {
		id: 2,
		title: 'Our awesome discussion',
		posts: [
			{
				owner: {
					name: 'Baptiste Metge',
					img: 'resources/zooportraits/llama.jpg'
				},
				content: 'I don\'t really find this paragraph useful',
				date: new Date(2013, 2, 3),
				score: -1
			},
			{
				owner: {
					name: 'Fabio Guigou',
					img: 'resources/zooportraits/fox.jpg'
				},
				content: 'I differ, this seems to be the most important part for me!',
				date: new Date(2013, 2, 2),
				score: 10
			}
		]
	};

	var document1 = {
		id: 1,
		title: 'My document title',
		content: [
			{
				title: 'First section',
				content: '',
				level: 1,
				discussions: []
			},
			{	title: 'First subsection',
				content: 'Aenean a felis. Aenean aliquam pretium orci. Aenean mi libero, ultrices id, suscipit vitae, dapibus eu, metus.',
				level: 2,
				discussions: []
			},
			{	title: 'Second subsection',
				content: 'Aenean sagittis commodo erat. Aenean vestibulum nibh ac massa. Aliquam erat volutpat. Aliquam id lacus.',
				level: 2,
				discussions: []
			},
			{	title: 'Second section',
				content: 'Aliquam imperdiet gravida tortor. Aliquam molestie. Aliquam non sapien. Aliquam pulvinar libero. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Cras consectetuer, nibh in lacinia ornare, turpis sem tempor massa, sagittis feugiat mauris nibh non tellus. Cras et justo a mauris mollis imperdiet. Cras sodales pretium massa. Cras vestibulum diam ut arcu. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur a libero vel tellus mattis imperdiet. Curabitur blandit nunc non arcu. Curabitur massa felis, accumsan feugiat, convallis sit amet, porta vel, neque. Curabitur scelerisque imperdiet nisl. Curabitur tristique scelerisque dui. Curabitur turpis. Donec a magna vitae pede sagittis lacinia. Donec auctor molestie augue. Donec congue leo eu lacus. Donec non nibh. Donec pretium. Donec viverra, sapien mattis rutrum tristique, lacus eros semper tellus, et molestie nisi sapien eu massa. Donec vulputate, orci ornare bibendum condimentum, lorem elit dignissim sapien, ut aliquam nibh augue in turpis. Duis consectetuer, ipsum et pharetra sollicitudin, metus turpis facilisis magna, vitae dictum ligula nulla nec mi. Duis dictum. Duis eget lectus in nibh lacinia auctor. Duis et ligula non elit ultricies rutrum. Duis id nisi. Duis nunc magna, vulputate a, porta at, tincidunt a, nulla. Duis semper tellus ac nulla. Duis sollicitudin erat sit amet turpis. Etiam eget magna. Etiam lacus lectus, mollis quis, mattis nec, commodo facilisis, nibh. Fusce enim. Fusce est metus, feugiat at, porttitor et, cursus quis, pede. Fusce in nulla quis est cursus gravida. Fusce interdum lectus non dui. Fusce suscipit rhoncus sem. Fusce vitae velit at libero sollicitudin sodales. In congue, neque ut scelerisque bibendum, libero lacus ullamcorper sapien, quis aliquet massa velit vel orci. In hac habitasse platea dictumst. In nibh. In scelerisque enim sit amet turpis. In venenatis imperdiet neque. Integer accumsan. Integer fermentum pretium massa. Integer imperdiet, orci a eleifend mollis, velit nulla iaculis arcu, eu rutrum magna quam sed elit. Integer in mi a mauris ornare sagittis. Integer interdum purus nec mauris. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris a nunc. Mauris aliquet orci quis tellus. Mauris at tortor eu lectus tempor tincidunt. Mauris bibendum, turpis ac viverra sollicitudin, metus massa interdum orci, non imperdiet orci ante at ipsum. Mauris condimentum massa ut metus. Mauris eu nunc. Mauris ligula felis, luctus a, aliquet nec, vulputate eget, magna. Mauris ultrices, turpis eu adipiscing viverra, justo libero ullamcorper massa, id ultrices velit est quis tortor. Morbi dictum massa id libero. Morbi erat mi, ultrices eget, aliquam elementum, iaculis id, velit. Morbi facilisis. Morbi feugiat iaculis nunc. Morbi quis leo vel magna commodo rhoncus. Morbi semper. Morbi vulputate vestibulum elit. Nam massa leo, iaculis sed, accumsan id, ultrices nec, velit. Nam sapien tellus, tempus et, tempus ac, tincidunt in, arcu. Nam ut augue. Nulla elit nunc, congue eget, scelerisque a, tempor ac, nisi. Nulla id arcu sit amet dui lacinia convallis. Nulla nulla. Nulla posuere. Nullam egestas. Nullam in velit. Nullam nibh sapien, volutpat ut, placerat quis, ornare at, lorem. Nullam sit amet arcu. Nullam ullamcorper. Nunc accumsan, nunc sit amet scelerisque porttitor, nibh pede lacinia justo, tristique mattis purus eros non velit. Nunc ante urna, gravida sit amet, congue et, accumsan vitae, magna. Nunc et est eu massa eleifend mollis. Nunc eu nunc eget felis malesuada fermentum. Nunc imperdiet augue. Nunc lorem turpis, imperdiet id, gravida eget, aliquet sed, purus. Pellentesque at erat id mi consequat congue. Pellentesque felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
				level: 1,
				discussions: [discussion1, discussion2]
			},
			{	title: 'Third section',
				content: 'Phasellus ac eros. Phasellus at dolor a enim cursus vestibulum. Phasellus justo purus, pharetra ut, ultricies nec, consequat vel, nisi. Phasellus mi. Phasellus tincidunt, nibh ut tincidunt lacinia, lacus nulla aliquam mi, a interdum dui augue non pede. Praesent a nisl ut diam interdum molestie. Praesent est. Praesent facilisis. Praesent hendrerit est et risus. Praesent interdum accumsan ante. Praesent luctus, lorem a mollis lacinia, leo turpis commodo sem, in lacinia mi quam et quam. Praesent luctus. Praesent mollis consectetuer quam. Praesent sollicitudin. Proin a ante. Proin at libero eu diam lobortis fermentum. Proin magna nulla, pellentesque non, commodo et, iaculis sit amet, mi. Proin quis mauris ac orci accumsan suscipit. Proin tincidunt. Quisque condimentum, lacus volutpat nonummy accumsan, est nunc imperdiet magna, vulputate aliquet nisi risus at est. Quisque consectetuer nisl eget elit. Quisque id augue. Quisque laoreet viverra felis. Quisque magna. Quisque placerat diam sed arcu. Quisque posuere malesuada velit. Quisque quam. Sed aliquam, odio nonummy ullamcorper mollis, lacus nibh tempor dolor, sit amet varius sem neque ac dui. Sed ipsum. Sed pellentesque mi a purus. Sed sit amet elit nec ipsum aliquam egestas. Sed sodales sapien ac ante. Sed vel libero nec elit feugiat blandit. Suspendisse dapibus dignissim dolor. Suspendisse nonummy. Suspendisse potenti. Suspendisse sodales feugiat purus. Suspendisse tempor. Suspendisse vel lorem ut ligula tempor consequat. Ut mattis. Ut nec nibh. Ut neque. Ut vehicula laoreet ante. Vestibulum ac mi in nunc suscipit dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce erat tortor, mollis ut, accumsan ut, lacinia gravida, libero. Vestibulum purus nulla, accumsan et, volutpat at, pellentesque vel, urna. Vestibulum scelerisque lobortis dolor. Vivamus eget pede. Vivamus est ligula, consequat sed, pulvinar eu, consequat vitae, eros. Vivamus et justo at augue aliquet dapibus. Vivamus quis tellus vel quam varius bibendum. Vivamus venenatis velit eget enim. Vivamus vestibulum libero vitae purus.',
				level: 1,
				discussions: []
			}
		]
	};

	var document2 = {
		id: 2,
		title: 'Cahier OSEO',
		content: [
			{
				title: 'Résumé exécutif',
				content: 'super résumé',
				level: 1,
				discussions: []
			},
			{
				title: 'Description',
				content: 'blabla',
				level: 1,
				discussions: []
			},
			{
				title: "Étude de marché",
				content: 'fnudfhdf',
				level: 1,
				discussions: []
			}
		]
	};

	var user1 = {
		id: 1,
		name: 'Paul Mougel',
		img: 'resources/zooportraits/giraffe.jpg',
		password : 'paul',
		email : 'paul.mougel@insa-lyon.fr',
		documents: [
			{title: document1.title, id: document1.id},
			{title: document2.title, id: document2.id}
		]
	};

	var user2 = {
		id: 2,
		name: 'Baptiste Metge',
		img: 'resources/zooportraits/llama.jpg',
		password : 'baptiste',
		email : 'baptiste.metge@insa-lyon.fr',
		documents: []
	};

	var user3 = {
		id: 3,
		name: 'Fabio Guigou',
		img: 'resources/zooportraits/fox.jpg',
		password : 'fabio',
		email : 'fabio.guigou@insa-lyon.fr',
		documents: []
	};

	// Configure the mock backend with mock URLs
	$httpBackend.whenGET(/\/mockAPI\/discussion\/1/).respond(discussion1);
	$httpBackend.whenGET(/\/mockAPI\/discussion\/2/).respond(discussion2);
	$httpBackend.whenPOST(/\/mockAPI\/discussion/).respond(); // TODO: should probably do something?
	$httpBackend.whenGET(/\/mockAPI\/document\/1/).respond(document1);
	$httpBackend.whenGET(/\/mockAPI\/document\/2/).respond(document2);
	$httpBackend.whenPOST(/\/mockAPI\/document\/1/).respond(); // TODO: should probably do something?
	$httpBackend.whenPOST(/\/mockAPI\/document\/2/).respond(); // TODO: should probably do something?
	$httpBackend.whenGET(/\/mockAPI\/user\/1/).respond(user1);
	$httpBackend.whenGET(/\/mockAPI\/user\/2/).respond(user2);
	$httpBackend.whenGET(/\/mockAPI\/user\/3/).respond(user3);

	// Configure some requests to go through (ie. get handled by the real server, not the mock one)
	$httpBackend.whenGET(/views/).passThrough();
});
