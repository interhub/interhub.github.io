var btn=document.getElementById("btn");
var one=document.getElementsByClassName("one")[0];
var two=document.getElementsByClassName("two")[0];
var tree=document.getElementsByClassName("tree")[0];
var nav=document.getElementsByClassName("nav")[0];
var footer=document.getElementsByTagName("footer")[0];
//////
var variant=document.getElementsByClassName("variant")[0];
var h1=document.getElementsByClassName("top")[0];
var div=document.getElementsByTagName("div");
var el=document.all;
///
window.onload=()=>{
  if(
    localStorage.getItem("tem")==1){
      add("black","sans-serif","white","black","white","black","white",1);
    }
  if (
    localStorage.getItem("tem") == 2) {
  add("black","sans-serif","lightslategray","darkred","white","darkred","white",2);
  }
  if (
    localStorage.getItem("tem") == 3) {
  add("white","sans-serif","green","darkgreen","which","darkgreen","white",3);
  }
}
btn.onclick=()=>{
  variant.style.display = "flex";
  footer.style.bottom = -450 + "px";
  
}
/////
one.onclick = () => {
  add("black","sans-serif","white","black","white","black","white",1);
}
two.onclick = () => {
  add("black","sans-serif","lightslategray","darkred","white","darkred","white",2);
}
tree.onclick = () => {
  add("white","sans-serif","green","darkgreen","which","darkgreen","white",3);
}

function add(col, font, bg, h1f, list, bgbtc ,btc,tem){
  for(let x of el){
    x.style.backgroundColor=bg;
    x.style.color=col;
    x.style.fontFamily=font;
  }
  btn.style.backgroundColor=bgbtc;
  btn.style.color=btc;
  h1.style.backgroundColor=h1f;
  h1.style.color=btc;
 
 one.style.backgroundColor="black";
  two.style.backgroundColor="darkred";
   tree.style.backgroundColor="green";
  variant.style.display="none";
  footer.style.bottom=-250+"px";
  
  localStorage.setItem("tem",tem);
}