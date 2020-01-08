
var style=document.getElementById("style");
var set_theme=document.getElementById("set_theme");
var i=0||localStorage.getItem("#i");


set_theme.onclick=()=>{
  i++; i>=3?i=0:true;
  console.log("setstyle "+i);
  localStorage.setItem("#i",i);
  if(i===0){
    style.href="s3.css";
    localStorage.setItem("#theme","s3.css")
  }
  if(i===1){
    style.href="s1.css";
    localStorage.setItem("#theme", "s1.css");
  }
  if(i===2){
    style.href="s2.css";
    localStorage.setItem("#theme", "s2.css");
  }
  
}

window.onload=()=>{
  if(localStorage.getItem("#theme")){
  style.href=localStorage.getItem("#theme");
  i=localStorage.getItem("#i");}
  else style.href="s3.css";
}