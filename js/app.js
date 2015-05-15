// Using JQUERY to send AJAX request to the server to get the data
// $.getJSON("/url", function(data){
// 	var allScenes = data;
// })
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
	// {
	// 	'location': [48.8554141, 2.3544136],
	// 	'title': 'Where it all began',
	// 	'imgSrc': 'img/scene01.jpg',
	// 	'description': 'A fair description of the scene and why you personally connect with it'
	// },
	// {
	// 	'location': [48.8554141, 2.3544136],
	// 	'title': 'Where it all began',
	// 	'imgSrc': 'img/scene01.jpg',
	// 	'description': 'A fair description of the scene and why you personally connect with it'
	// },
	// {
	// 	'location': [48.8554141, 2.3544136],
	// 	'title': 'Where it all began',
	// 	'imgSrc': 'img/scene01.jpg',
	// 	'description': 'A fair description of the scene and why you personally connect with it'
	// },
	// {
	// 	'location': [48.8554141, 2.3544136],
	// 	'title': 'Where it all began',
	// 	'imgSrc': 'img/scene01.jpg',
	// 	'description': 'A fair description of the scene and why you personally connect with it'
	// },
	{
		'location': [48.852547, 2.34712],
		'title': 'Where it all began',
		'imgSrc': 'img/scene01.jpg',
		'description': 'A fair description of the scene and why you personally connect with it'
	},
	{
		'location': [48.85201147, 2.35499296],
		'title': 'Where it all began2',
		'imgSrc': 'img/scene01.jpg',
		'description': '1-A fair description of the scene and why you personally connect with it'
	},
	{
		'location': [48.85148906,2.35797558],
		'title': 'Where it all began3',
		'imgSrc': 'img/scene01.jpg',
		'description': '2-A fair description of the scene and why you personally connect with it'
	}
];
var myJSON = JSON.stringify(allScenes);
console.log(myJSON);
var ViewModel = function() {

	var self = this;

	
	var mapOptions = {
          center: { lat: 48.851302, lng: 2.345127},
          zoom: 15
        };
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    
    
	this.scenesList = ko.observableArray([]);

	allScenes.forEach(function(sceneItem){
		self.scenesList.push( new Scene(sceneItem) );
	});

	this.currentScene = ko.observable( this.scenesList[0] );
	console.log(this.scenesList()[0]['location'][0]);

	this.setMe = function() {
		infowindow.setContent(this.node);
		infowindow.open(self.map, this);
		console.log("I have been Clicked!");
	}
	// Create Markers for all scenes inside scenesList
	this.markersList = ko.observableArray([]);

	
	var contentString = 'Hello';

	var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
	
	// A function to add content to infowindow
	createContent = function(index) {
		contentString = '<div>'+ '<h2>' + self.scenesList()[index]['title'] + '<h2>' +
						'<p>' + self.scenesList()[index]['description'] + '</p>'+ '</div>';
		google.maps.event.addListener(self.markersList()[index], 'click', function(content) {
    		return function() {
    			infowindow.setContent(content);
    			infowindow.open(this.map, this);
    			console.log(this);
    			}
  			}(contentString));
	}
	
	createMarkers = function() {
		console.log("function createMarkers started");
		for(i=0; i<self.scenesList().length; i++) {
			
			var mylatLng = new google.maps.LatLng(self.scenesList()[i]['location'][0], self.scenesList()[i]['location'][1]);
    		var marker = new google.maps.Marker({
				position: mylatLng,
				map: self.map,
				title: self.scenesList()[i].title
			});
			marker.node = '<div>'+ '<h2>' + self.scenesList()[i]['title'] + '<h2>' +
						'<p>' + self.scenesList()[i]['description'] + '</p>'+ '</div>';
			marker.imgSrc = self.scenesList()[i]['imgSrc'];
			self.markersList.push(marker);
			// Attach a click event listener to each marker to open the infowindow
			createContent(i);
		}
	}
	createMarkers();
	console.log(this.markersList()[0]['node']);

	
	// Create infowindows
	

    

   	// setWindow = function() {
   	// 	console.log("Setting up info windows");
   	// 	for(i=0; i<self.markersList().length; i++) {
   	// 		google.maps.event.addListener(self.markersList()[i], 'click', function() {
   	// 			infowindow.open(self.map, self.markersList()[i]);
   	// 		});
   	// 	}
   	// }
   	// setWindow();
  	


}

ko.applyBindings(new ViewModel());

// Using Jquery closet to implement the search/filter function
$("#search-criteria").on("keyup", function() {
	var g = $(this).val().toLowerCase();
	$(".title").each(function(){
		var s =$(this).text().toLowerCase();
		$(this).closest('.SceneItem')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
	});
});

// $("#search-criteria").on("keyup", function() {
//     var g = $(this).val().toLowerCase();
//     $(".fbbox .fix label").each(function() {
//         var s = $(this).text().toLowerCase();
//         $(this).closest('.fbbox')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
//     });
// });
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
