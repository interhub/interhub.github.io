console.log('Hello World!');
var i=0;var all;
var h=1;var maxH=10;
var animGrow;var scoreTime;
var score=localStorage.score||0;
$("#score").text(score);
var now=0;
var blockTime;
var danger=false;
var R;


//гравитация
class Block{
 constructor(){
  var spead=3;
  R=Math.floor(Math.random()*300)-150;
  let blockTop=$("<div id='block'></div>");
  blockTop.css({
   "background-color":"green",
   "width":"100px",
   "height":innerHeight/4+R+"px",
   "position":"absolute",
   "border-radius":"0 0 5px 5px",
   "top":"0",
   "right":"-100px"
  })
  $("#box").append(blockTop);
  
  let blockDown=$("<div id='block'></div>");
  blockDown.css({
   "background-color":"green",
   "width":"100px",
   "height":innerHeight/4-R+"px",
   "position":"absolute",
   "border-radius":"5px 5px 0 0",
   "bottom":"0",
   "right":"-100px"
  })
  $("#box").append(blockDown);
  var move=()=>{
   blockTop.css("right",`+=${spead}px`);
   blockDown.css("right",`+=${spead}px`)
   requestAnimationFrame(move)
  }
  move()
 }
}


class Game{
 constructor(){
  all=this;
  this.blocks=[];
 }
 grawOn(){
  $("#duck").css("top",
  `+=${(h*=1.08)<maxH?
   h:maxH
  }px`)
  animGrow=requestAnimationFrame(all.grawOn)
 }
 grawOff(){
  
 }
 isDead(){
  var bp=document.querySelector("#block");
  var wid=innerWidth;
  var hei=innerHeight;
  var wd=70;
  var hd=wd;
  var DP=$("#duck").position()
  var wb=100;
  var hb=hei/4;
  var ram=[];
  var D=R;
  var bass=document.querySelectorAll("#block");
  bass.forEach(el=>{
   ram.push(el)
  })
  var isD=ram.some((el)=>{
   
  return(( parseInt(el.style.right)+wb>wid/2+80 )&&parseInt(el.style.right)<wid/2+80+wd)
  })
   if(isD){
    danger=true;
    //console.log("danger")
    //условия проигрыша
    if(DP.top<hb+R-30||DP.top+hd>hei-(hb-R)+30){
     return true;
    }
   }else{
    danger=false;
   }
  return false
 }
 start(){
  all.grawOn();
  scoreTime=setInterval(()=>{
   now++;
   if(now>score){
    localStorage.score=now;
    $("#score").text(now);
   }
   $('#now').text (now)
  },500)
  var t1=setInterval(()=>{
   if($("#duck").position().top>50+innerHeight){
    clearInterval(t1)
    
    console.log(document.querySelector("#duck").getBoundingClientRect())
    all.over()
   }
   if(all.isDead()){
     all.over()
    }
  },20)
  
  blockTime=setInterval(()=>{
   $("#block").remove();
   all.blocks.push(new Block())
  },5000)
  
  window.onclick=()=>{
   h=1;
   $("#duck").animate({
    top:"-=100px"
   },200)
  }
 }
 stop(){
  
 }
 over(){
  cancelAnimationFrame(animGrow);
  clearTimeout(scoreTime);
  now=0;
  $("#now").text("0");
  $("#duck").css("top",innerHeight*0.3+"px");
  $("body").one("click",all.start)
 clearInterval(blockTime);
 $('div[id=block]').remove();
 }
}


const App=new Game()
$("body").one("click",
App.start)

window.ondblclick=()=>{
 //console.log($("#duck").position(),$("#block").position())
}