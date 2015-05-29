//This file is for our jquery DOM manipulation to make sure the website is responsive
$(document).ready(function() {
    // Our function is going to be loaded once the page loads and whenever the windows size change
    checkSize();

    // run when window size change
    $(window).resize(checkSize);
});

var mapH; // the height of the map
//.flex-direction changes using media queries. So we are using this css property to detect media queries.
function checkSize(){
    if ($(".scenes-container").css("flex-direction") == "row" ) {

		mapH = window.innerHeight - ($('.header').height() + 185);
		$('.map').css("height", mapH + "px");
		$('.scenes-container').height(175);
    }
    if ($(".scenes-container").css("flex-direction") == "column" ) {
		mapH = window.innerHeight - $('.header').height();
		$('.map').height(mapH);
        $('.scenes-container').height(mapH);
        // Checking for Landscape view
        if ($(".sidebar").css("position") == "absolute" ) {
            console.log("landscape");

            $('.map').width(window.innerWidth-$('.scenes-container').width);
            $('.scenes-container').height(window.innerHeight);
        }
		console.log("Map is set to fit column scenes");
    }
}