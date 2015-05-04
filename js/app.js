// Intializing Google Map

// Start of my app
var Scene = function (data) {
	this.location = data.location;
	this.title = data.title;
	this.imgSrc = data.imgSrc;
	this.description = data.description;
}
//scene01 = new Scene([48.851302, 2.36169044], "God does not rule with dice!", '../img/scene01.jpg', "Some Description about the scene");
// console.log(scene01.location);
// console.log(scene01.title);
var allScenes = [
	{
		'location': [48.8554141, 2.3544136],
		'title': 'Where it all began',
		'imgSrc': '../img/scene01.jpg',
		'description': 'A fair description of the scene and why you personally connect with it'
	},
	{
		'location': [48.85201147, 2.35499296],
		'title': 'Where it all began2',
		'imgSrc': '../img/scene01.jpg',
		'description': 'A fair description of the scene and why you personally connect with it'
	},
	{
		'location': [48.85148906,2.35797558],
		'title': 'Where it all began3',
		'imgSrc': '../img/scene01.jpg',
		'description': 'A fair description of the scene and why you personally connect with it'
	}
];
var ViewModel = function() {

	var self = this;

	
	var mapOptions = {
          center: { lat: 48.851302, lng: 2.345127},
          zoom: 15
        };
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    var scene02 = new google.maps.LatLng(48.85379665, 2.36169044);
    var myMarker = new google.maps.Marker({
			position: scene02,
			map: self.map,
			title: 'Hello Marker!'
		});
    console.log("Marker Added or not!");
    console.log("Did the map load?!");
    //google.maps.event.addDomListener(window, 'load', initialize);
	

	this.scenesList = ko.observableArray([]);

	allScenes.forEach(function(sceneItem){
		self.scenesList.push( new Scene(sceneItem) );
	});

	this.currentScene = ko.observable( this.scenesList[0] );
	console.log(this.scenesList()[0]['location'][0]);
	this.setMe = function() {
		console.log("I have been Clicked!");
	}
	// Create Markers for all scenes inside scenesList
	this.markersList = [];

	createMarkers = function() {
		console.log("function createMarkers started");
		for(i=0; i<self.scenesList().length; i++) {
			console.log(self.scenesList()[0]['location'][1]);
			var mylatLng = new google.maps.LatLng(self.scenesList()[i]['location'][0], self.scenesList()[i]['location'][1]);
    		var marker = new google.maps.Marker({
				position: mylatLng,
				map: self.map,
				title: self.scenesList()[i].title
			});
			self.markersList.push(marker);
		}
	}
	createMarkers();
	console.log(this.markersList);
	// Show markers on the map
	for (i=0; i<self.markersList; i++) {
		this.markersList[i].setMap(map);
	}
}

ko.applyBindings(new ViewModel());




// Define a class for all scenes in the form of a constructor function Scene();
// var Scene = function (data) {
// 	this.location = data.location;
// 	this.title = data.title;
// 	this.imgSrc = data.imgSrc;
// 	this.description = data.description;
// }
//scene01 = new Scene([48.851302, 2.36169044], "God does not rule with dice!", '../img/scene01.jpg', "Some Description about the scene");
// console.log(scene01.location);
// console.log(scene01.title);
// var scenes = [
// 	{
// 		'location': {48.851302, 2.345127},
// 		'title': 'Where it all began',
// 		'imgSrc': '../img/scene01.jpg',
// 		'description': 'A fair description of the scene and why you personally connect with it'
// 	},
// 	{
// 		'location': {48.851302, 2.345127},
// 		'title': 'Where it all began2',
// 		'imgSrc': '../img/scene01.jpg',
// 		'description': 'A fair description of the scene and why you personally connect with it'
// 	},
// 	{
// 		'location': {48.851302, 2.345127},
// 		'title': 'Where it all began3',
// 		'imgSrc': '../img/scene01.jpg',
// 		'description': 'A fair description of the scene and why you personally connect with it'
// 	}
// ];
// A function to create markers from the allscenes array.
// Function createMarkers(){
// 	for (i = 0; i < allscenes.length; i++) {

// 	}
// }

// // Sets the map on all markers in the array.
// function setAllMap(map) {
//   for (var i = 0; i < markers.length; i++) {
//     markers[i].setMap(map);
//   }
// }

// // Removes the markers from the map, but keeps them in the array.
// function clearMarkers() {
//   setAllMap(null);
// }

// // Shows any markers currently in the array.
// function showMarkers() {
//   setAllMap(map);
// }
