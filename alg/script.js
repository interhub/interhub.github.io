//var width = prompt("Введите ширину");
//var height = prompt("Введите высоту");
var cont = document.getElementById ("cont");
var ram_box;
var input1 = document.getElementById("input1");
var input2 = document.getElementById("input2");
var num=0;
var reset_otvet;
var reset_ram;
var S;
var w;
var h;
box.className = "cont";

function start(){
var width=input1.value;
   w=width;
var height=input2.value;
   h=height;
 cont.innerText="";
   reset_otvet=0;
/*if(!x||!y) {
   cont.innerText ="Введите значения";
        return 0;
    } */
set(width, height);
 
 input1.value="";
 input2.value="";
}

function set(x, y)
{
 num++;
   if(num==100) {return 0;num=0;}
var box = document.createElement("div");
box.style.width = x/5 +"px";
box.style.height = y/5 + "px";
box.style.backgroundColor = "#6649cd";
box.style.margin = 5 +"px";
box.style.position = "relative";
cont.appendChild(box);
box.style.color = "white";
var p = document.createTextNode( x+" x "+y);
cont.appendChild(p);
ram_box=box;
if(reset_otvet==0){reset_ram=box;}
   reset_otvet++;
prov(x,y);
    
    
}

function prov(x,y){
    
    if (x==y){
        otvet(x,y);
    }else if (x>y){
        var ram1 = Math.ceil(x/y)-1;
        ram1*=y;
        x-=ram1;
        set(x,y);
        
    } else if (x<y){
        var ram2 = Math.ceil(y/x)-1;
        ram2*=x;
        y-=ram2;
        set(x,y);
    }
}

function otvet(x,y)
{
    var h4 = document.getElementById("h4");
    h4.style.color= "#1449ad";
    h4.style.textDecoration= "underline";
    h4.innerText= ("Ответ: размер: "+x+" x "+y+"\n Количество областей: "+S());
    box_otvet(x,y);
   x_otvet=x;
   y_otvet=y;
   function S(){
     return (w*h)/(x*y);
   }
} 
    
function box_otvet(x,y){
   var in_box = document.createElement("div");
   reset_ram.appendChild(in_box);
   in_box.style.position="absolute";
   in_box.style.backgroundColor="red";
   in_box.style.width = x/5 +"px";
   in_box.style.height = y/5 + "px";
   in_box.style.top=0+"px";
   in_box.style.left=0+"px";
   }

    