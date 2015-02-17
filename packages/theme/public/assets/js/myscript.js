// For hover 
$(function() {
		$(' #da-thumbs > li ').each( function() { $(this).hoverdir(); } );
	});
// Win height 
$(document).ready(function(e) {
	var winHeight = $(window).height();
	$('.landing-section').css('min-height',winHeight);
});
// Smooth Scroll 
 //  var hashTagActive = "";
	// $("a.work-btn").click(function (event) {
	// 	if(hashTagActive != this.hash) {
	// 		event.preventDefault();
	// 		var dest = 0;
	// 		if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
	// 			dest = $(document).height() - $(window).height();
	// 		} else {
	// 			dest = $(this.hash).offset().top;
	// 		}
	// 		$('html,body').animate({
	// 			scrollTop: dest
	// 		}, 1000, 'swing');
	// 		hashTagActive = this.hash;
	// 	}
	// });
	
