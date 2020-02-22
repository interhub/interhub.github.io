console.log('Hello World!');
async function times(){
 var i=0;
   do{
    await new Promise(es=>setTimeout(es,2))
    $("#burger").css({
     "transform":`rotate(${i}deg)`,
     "filter":" blur(1px)"
    })
    i+=30
   }while(i<750)
   $("#burger").css("filter","blur(0)")
  }

var menu=$("#menu");
var items=$("#items");
var tops=$("#tops");

$("button").click(
 ()=>{
  
  times()
  if(menu.attr("class")=="off"){
   menu.attr("class","on");
   setTimeout(()=>
   menu.animate({
    width:"100vw"
   },300),200);
   items.animate({
    width:"80vw"
   },300)
   tops.animate({
    height:"100vh"
   });
  }else{
   menu.attr("class","off");
   menu.animate({
    width:"0"
   },200)
   items.animate({
    width:"0"
   },400)
   tops.animate({
    height:"0"
   })
  }
 })