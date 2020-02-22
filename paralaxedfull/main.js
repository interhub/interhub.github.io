console.log('Hello World!');

$(window).on("scroll",()=>{
 var scrolled=$(window).scrollTop()
 motion(scrolled)
})

function motion(scr){
 $("#bg-1").css("top",500-scr*0.7+"px");
 $("#bg-2").css("top",1600-scr*0.7+"px")
 $("#bg-3").css("top",2700-scr*0.7+"px")
 $("#info").text(scr)
 
 $("#top").css("top",0-scr*0.05+"px")
 $("#center").css("top",80-scr*0.05+"px")
 $("#bottom").css("top",160-scr*0.05+"px")
 $("#top").css("top",0-scr*0.05+"px")
 
 
 if(scr>3900){
  $("#bottom").hide()
 }else{
  $("#bottom").show()
 }
 
 if(scr>2310){
  $("#center").hide()
 }else{
  $("#center").show()
 }
 
 if (scr > 720) {
  $("#top").hide()
 } else {
  $("#top").show()
 }
 
}
motion(0)

