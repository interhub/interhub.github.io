var input = document.getElementById("input");
var ram_anim;
var box = document.getElementById("box");
var btn = document.getElementById("btn");
var len = document.getElementById("len");
btn.onclick=add;
var c1=document.getElementById("check1");
var c2=document.getElementById("check2");
var c3=document.getElementById("check3");
var c4=document.getElementById("check4");
c1.checked=true;
c2.checked=true;
c3.checked=true;
c4.checked=true;

function add(){
  var pass="";
  var len_num=len.value;
 if(
   c1.checked===false&&
   c2.checked===false&&
   c3.checked===false&&
   c4.checked===false){
     return 0;
   }
while(pass.length<len_num ){
  
  var R=Math.ceil(Math.random()*4);
  var R1=prov(R);
  
  switch(R1){
    case 1: pass+=cif();break;
    case 2: pass+=buk();break;
    case 3: pass+=sim();break;
    case 4: 
      pass+= buk().toUpperCase();break;
      default: pass+="";break;
      }
}
       var text="";
   text=pass;
  var p= document.createElement("li");
  box.appendChild(p);
  ram_anim=p;
  
  
  p.innerText=text;
}

function prov(R){
  
 if(c1.checked===false){
   if(R==1){
   R++;
   prov(R);}
 } else {
   if(R==1){
   return R;}
   }
 
 if (c2.checked === false) {
   if (R == 2) {
     R++;
     prov(R);
   }
 } else {
   if (R == 2) {
     return R;
   }
 }
 
 if (c3.checked === false) {
   if (R == 3) {
     R++;
     prov(R);
   }
 } else {
   if (R == 3) {
     return R;
   }
 }
 
 if (c4.checked === false) {
   if (R == 4) {
     R++;
     prov(R);
   }
 } else {
   if (R == 4) {
     return R;
   }
 }
}
//константы
function sim(){
  var R=Math.ceil(Math.random()*7);
  switch(R){
    case 1: return "<"; 
    case 2: return "?"; 
    case 3: return "."; 
    case 4: return "#"; 
    case 5: return "_"; 
    case 6: return "!"; 
    case 7: return "*"; 
  }
}

function cif() {
  var R = Math.ceil(Math.random() * 10);
  switch (R) {
    case 1:
      return "0";
    case 2:
      return "1";
    case 3:
      return "2";
    case 4:
      return "3";
    case 5:
      return "4";
    case 6:
      return "5";
    case 7:
      return "6";
    case 8:
      return "7";
    case 9: 
      return "8";
    case 10:
      return "9";
  }
}

function buk() {
  var R = Math.ceil(Math.random() * 26);
  switch (R) {
    case 1:
      return "a";
    case 2:
      return "b";
    case 3:
      return "c";
    case 4:
      return "d";
    case 5:
      return "e";
    case 6:
      return "f";
    case 7:
      return "g";
    case 8:
      return "h";
    case 9:
      return "i";
    case 10:
      return "j";
    case 11:
      return "k";
    case 12:
      return "l";
    case 13:
      return "m";
    case 14:
      return "n";
    case 15:
      return "o";
    case 16:
      return "p";
    case 17:
      return "q";
    case 18:
      return "r";
    case 19:
      return "s";
    case 20:
      return "t";
    case 21:
      return "u";
    case 22:
      return "v";
    case 23:
      return "w";
    case 24:
      return "x";
    case 25:
      return "y";
    case 26:
      return "z";
  }
}

