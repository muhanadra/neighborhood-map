// Using JQUERY to send AJAX request to the server to get the data and Start our App
var allScenes;
$.getJSON("scenes.json", function(data){
	allScenes = data;
	ko.applyBindings(new ViewModel());
})

// Class for all our scenes objects
var Scene = function (data) {
	this.coordinates = data.coordinates;
	this.title = data.title;
	this.imgSrc = data.imgSrc;
	this.description = data.description;
	this.location = data.location;
	this.quote = data.quote;
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
	this.wikiDiv = ko.observableArray([]);

	allScenes.forEach(function(sceneItem){
		self.scenesList.push( new Scene(sceneItem) );
	});

	// Set the content and open the infowindow when the user click on a scene.
	this.setMe = function() {
		infowindow.setContent(this.node);
		this.map.setCenter(this.getPosition());
		infowindow.open(self.map, this);
	}

	// An observable array for all our markers
	this.markersList = ko.observableArray([]);

	// Creating a new InfoWindow Object, read google maps doc for more nfo
	var contentString;

	var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

	// A function to create the content
	createContentString = function(index) {
		// AJAX request to Wikipedia to pull random info about the filming location
    	var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.scenesList()[index]['location'] +
    			 '&format=json&callback=wikiCallback';
	    var wikiRequestError = setTimeout(function(){
	    	console.log("Connectoin to wikipedia failed");
	    	contentString = '<div class="info">'+ '<h4>' + self.scenesList()[index]['title'] + '</h4>' +
						'<p>' + self.scenesList()[index]['description'] + '</p>'+ '</div>';
			return	contentString;
	    }, 3000);

    	// if (localStorage['wikiLinks']) {
	    // 	var wikiLinks = localStorage.getItem['wikilinks'];
	    // 	console.log("No connection to wikipedia needed");
	    // 	console.log(localStorage.getItem['wikilinks']);
    	// }
    	// else {
	    	$.ajax({
    		    type: "GET",
    		   	url: wikiUrl,
    		    async: true,
    		    dataType: "jsonp",
    		    success: function (response) {
    		        console.log(response);
    		        var arTitle = response[1][0];
    		       	var arLink = response[3][0];
    		        console.log(arTitle + arLink);
    		        console.log("Connection made to Wikipedia");
    		        // var wikiLinks = JSON.parse(data);
    		        // localStorage.setItem('wikiLinks', wikiLinks);
    		        var wikiDiv = '<div class="Wikipedia"><a target="_blank" href="' + arLink + '">' + arTitle + '</a></div>';

    		 		if(arTitle && arLink) {
    		 			self.wikiDiv().push( wikiDiv );
    		 			self.markersList()[index]['node'] = self.markersList()[index]['node'] + wikiDiv;
    		 		}
    		 		else {
    		 			self.wikiDiv().push( '<div class="Wikipedia">No Wikipedia Articles found</div>' );
    		 			self.markersList()[index]['node'] = self.markersList()[index]['node'] + '<div class="Wikipedia">No Wikipedia Articles found</div>';
    		 		}
    		 		localStorage.setItem('wikiDivs', self.wikiDiv());
    		 		console.log(self.wikiDiv());
    		 		clearTimeout(wikiRequestError);
    		    }

    	    });
    	// else }
    	contentString = '<div class="info">'+ '<h4>' + self.scenesList()[index]['title'] + '</h4>' +
						'<p>' + self.scenesList()[index]['description'] + '</p>'+ '</div>';
    	return(contentString);
	    // Creating our content String
		// contentString = '<div class="info">'+ '<h4>' + self.scenesList()[index]['title'] + '</h4>' +
		// 				'<p>' + self.scenesList()[index]['description'] + '</p>'+ '</div>';
	}

	// Class to create Object markers for all the scenes inside our observable array scenesList
	createMarkers = function() {
		for(i=0; i<self.scenesList().length; i++) {

			var mylatLng = new google.maps.LatLng(self.scenesList()[i]['coordinates'][0], self.scenesList()[i]['coordinates'][1]);
    		var marker = new google.maps.Marker({
				position: mylatLng,
				map: self.map,
				title: self.scenesList()[i].title
			});

			// Pushing our markers to the observable array markersList
    		self.markersList.push(marker);

			// Adding new properties to our markers
			marker.ind = i;
			marker.node = createContentString(i);
			marker.wiki = self.wikiDiv()[i];
			marker.imgSrc = self.scenesList()[i]['imgSrc'];

			// Attach a click event listener to each marker to open the infowindow
			google.maps.event.addListener(self.markersList()[i], 'click', function() {
    		return function() {
    			infowindow.setContent(this.node);
    			this.map.setCenter(this.getPosition());
    			infowindow.open(this.map, this);
    			}
  			}(this.node));
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
// 	this.coordinates = data.coordinates;
// 	this.title = data.title;
// 	this.imgSrc = data.imgSrc;
// 	this.description = data.description;
// }
//scene01 = new Scene([48.851302, 2.36169044], "God does not rule with dice!", '../img/scene01.jpg', "Some Description about the scene");
// console.log(scene01.coordinates);
// console.log(scene01.title);
// var scenes = [
// 	{
// 		'coordinates': {48.851302, 2.345127},
// 		'title': 'Where it all began',
// 		'imgSrc': '../img/scene01.jpg',
// 		'description': 'A fair description of the scene and why you personally connect with it'
// 	},
// 	{
// 		'coordinates': {48.851302, 2.345127},
// 		'title': 'Where it all began2',
// 		'imgSrc': '../img/scene01.jpg',
// 		'description': 'A fair description of the scene and why you personally connect with it'
// 	},
// 	{
// 		'coordinates': {48.851302, 2.345127},
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