// //This file is for our jquery DOM manipulation to make sure the website is responsive
$(document).ready(function() {
    // Our function is going to be loaded once the page loads and whenever the windows size change
    checkSize();

    // run when window size change
    $(window).resize(checkSize);
});

var mapH; // the height of the map
function checkSize(){
    mapH = window.innerHeight - ($('.header').height());
    $('.map').height(mapH);
    var headerH = $('.header').height();
    $('.map').css('margin-top', headerH);
    $('.menu').css('top', headerH);

    var searchH = $('.search-container').height();
	$('.scenes-container').height(mapH - searchH);
}

// Show our menu and hide it.
var menuIcon = $('.menu-icon-link');
menuIcon.on('click', function() {
        $('body').toggleClass('menu-hidden');
    });