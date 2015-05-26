//USing strict Mode
"use strict";
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
	var numOfScenes = self.scenesList().length;
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
	var createContentString = function(index) {
		// AJAX request to Wikipedia to pull random info about the filming location
    	var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.scenesList()[index]['location'] +
    			 '&format=json&callback=wikiCallback';
	    var wikiRequestError = setTimeout(function(){
	    	console.log("Connectoin to wikipedia failed");
	    	contentString = '<div class="info">'+ '<h4>' + self.scenesList()[index]['title'] + '</h4>' +
						'<p>' + self.scenesList()[index]['description'] + '</p>'+ '</div>';
			return	contentString;
	    }, 3000);

		contentString = '<div class="info">'+ '<h4>' + self.scenesList()[index]['title'] + '</h4>' +
			'<p>' + self.scenesList()[index]['description'] + '</p>'+ '</div>';

	    if (localStorage['cachedContent']) {
	    	var storedWiki = localStorage['cachedContent'];
	    	console.log(storedWiki);
	    	var parsedWiki = JSON.parse(storedWiki);
    		console.log(parsedWiki);
			contentString = contentString  + parsedWiki[index];
    		console.log("No connection to wikipedia needed");
    		clearTimeout(wikiRequestError);
	    }
    	else {
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
    		 			self.markersList()[index]['node'] = self.markersList()[index]['node'] + wikiDiv;
    		 			self.markersList()[index]['wiki'] = wikiDiv;
    		 		}
    		 		else {
    		 			self.markersList()[index]['wiki'] = '<div class="Wikipedia">No Wikipedia Articles found</div>';
    		 			self.markersList()[index]['node'] = self.markersList()[index]['node'] + '<div class="Wikipedia">No Wikipedia Articles found</div>';
    		 		}

    		 		clearTimeout(wikiRequestError);

    		 		var cachedContent = [];
    		 		if (index === (numOfScenes-1)) {
						function storeContent() {
							for(var j=0; j<numOfScenes; j++) {
								cachedContent.push(self.markersList()[j]['wiki']);
							}
							var stingCachedContent = JSON.stringify(cachedContent);
							localStorage.setItem('cachedContent', stingCachedContent);
						}
						storeContent();
    		 		}
    		    }
    	    });
    	}
    	// Returning our content String whenever this function is called.
    	return(contentString);
	}

	// Class to create Object markers for all the scenes inside our observable array scenesList
	var createMarkers = function() {
		for(var i=0; i<self.scenesList().length; i++) {
			var mylatLng = new google.maps.LatLng(self.scenesList()[i]['coordinates'][0], self.scenesList()[i]['coordinates'][1]);
    		var marker = new google.maps.Marker({
				position: mylatLng,
				map: self.map,
				title: self.scenesList()[i].title
			});

			// Pushing our markers to the observable array markersList
    		self.markersList.push(marker);

			// Adding new properties to our markers
			marker.node = createContentString(i);
			marker.wiki = null;
			marker.imgSrc = self.scenesList()[i]['imgSrc'];

			// Attach a click event listener to each marker to open the infowindow
			google.maps.event.addListener(self.markersList()[i], 'click', function() {
    		return function() {
    			infowindow.setContent(this.node);
    			this.map.setCenter(this.getPosition());
    			infowindow.open(this.map, this);
    			}
  			}(self.markersList()[i]['node']));
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