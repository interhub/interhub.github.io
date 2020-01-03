var scroll=document.getElementById("scroll");
var hd=document.querySelector("h4");

var p=document.querySelector("p");


addEventListener("scroll",function(){
 // p.innerText=`${pageYOffset} промотанное расстояние\n${document.body.scrollHeight} высота страницы\n${innerHeight} высота экрана`;
  var wid=(pageYOffset/(document.body.scrollHeight-innerHeight))*100;
  scroll.style.width=wid+"%";

 color(`#ef${Math.floor(wid)}22`);
 finish(wid);
  function color(col){scroll.style.backgroundColor=col;
  }console.log(wid);
  function finish(w){
  if((w)<100)up("none");else up("block");
  }
})
function up(dis){
   hd.style.display=dis;
}

