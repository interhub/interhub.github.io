console.log('Hello World!');

$(window).bind('scroll', function(e) {
 parallaxScroll();
});
var ison=true;

function parallaxScroll() {
 var scrolled = $(window).scrollTop();
 $('#bg1').css('top', (300 - (scrolled * .25)) + 'px');
 $('#bg2').css('top', (200 - (scrolled * .10)) + 'px');
 $('#bg3').css('top', (400 - (scrolled * .75)) + 'px');
 $('#coffe').css('top', (1300 - (scrolled * .55)) + 'px');
 $('#txt-coffe').css('top', (1700 - (scrolled * .75)) + 'px');
 $('#txt-cake').css({'right': (2200 - (scrolled * .75)) + 'px',
  "top":" 150px"
 });
 $('#cake').css('left', (2200 - (scrolled * .75)) + 'px');
 $('#txt-burger').css('top', (2700 - (scrolled * .75)) + 'px');
 $('#burger').css('top', (3350 - (scrolled * .96)) + 'px');
 
 if(scrolled>3600&&ison){
  $("#img").fadeIn(1500)
  ison=false;
 }
 if(scrolled<3550){
  ison=true
 $("#img").fadeOut(1000)
 }
}
parallaxScroll()
$("#img").hide()

