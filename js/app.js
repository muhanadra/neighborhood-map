// Using JQUERY to send AJAX request to the server to get the data and Start our App
var allScenes;
$.getJSON("scenes.json", function(data){
	allScenes = data;
	console.log(allScenes);
	ko.applyBindings(new ViewModel());
})


// Class for all our scenes objects
var Scene = function (data) {
	this.location = data.location;
	this.title = data.title;
	this.imgSrc = data.imgSrc;
	this.description = data.description;
}

// Our KnockOut ViewModel
var ViewModel = function() {

	var self = this;

	// Setting the map options
	var mapOptions = {
          center: { lat: 48.851302, lng: 2.345127},
          zoom: 15
        };

    // Loading our new map into the canvas.
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    
    // Putting our scenes objects from JSON file in an observableArray
	this.scenesList = ko.observableArray([]);

	allScenes.forEach(function(sceneItem){
		self.scenesList.push( new Scene(sceneItem) );
	});

	// Set the content and open the infowindow when the user click on a scene.
	this.setMe = function() {
		infowindow.setContent(this.node);
		infowindow.open(self.map, this);
	}

	// An observable array for all our markers
	this.markersList = ko.observableArray([]);

	// Creating a new InfoWindow Object, read google maps doc for more nfo
	var contentString;

	var infowindow = new google.maps.InfoWindow({
      content: contentString
    });


	
	// A function to create the content and assign an eventlistener to each marker
	createContent = function(index) {
		// AJAX request to Wikipedia to pull random info about the Movie
    	var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.scenesList()[index]['title'] +
    			 '&format=json&callback=wikiCallback';

	     $.ajax({
	        type: "GET",
	        url: wikiUrl,
	        async: false,
	        dataType: "jsonp",
	        success: function (data, textStatus, jqXHR) {
	 			console.log(data);
	 
	        },
	        error: function (errorMessage) {
	        }
	    });

	     // Creating our content String
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


	// Class to create Object markers for all the scenes inside our observable array scenesList
	createMarkers = function() {
		for(i=0; i<self.scenesList().length; i++) {
			
			var mylatLng = new google.maps.LatLng(self.scenesList()[i]['location'][0], self.scenesList()[i]['location'][1]);
    		var marker = new google.maps.Marker({
				position: mylatLng,
				map: self.map,
				title: self.scenesList()[i].title
			});

			// Adding new properties to our markers
			marker.node = '<div>'+ '<h2>' + self.scenesList()[i]['title'] + '<h2>' +
						'<p>' + self.scenesList()[i]['description'] + '</p>'+ '</div>';
			marker.imgSrc = self.scenesList()[i]['imgSrc'];

			// Pushing our markers to the observable array markersList
			self.markersList.push(marker);

			// Attach a click event listener to each marker to open the infowindow
			createContent(i);
		}
	}
	createMarkers();	
}

// Using Jquery to implement the search/filter function
$("#search").on("keyup", function() {
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
