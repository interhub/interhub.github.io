//var width = prompt("Введите ширину");
//var height = prompt("Введите высоту");
var cont = document.getElementById ("cont");

var input1 = document.getElementById("input1");
var input2 = document.getElementById("input2");
var num=0;
box.className = "cont";

function start(){
 
var width=input1.value;
var height=input2.value;
 cont.innerText="";
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
box.style.width = x/10 +"px";
box.style.height = y/10 + "px";
box.style.backgroundColor = "#6649cd";
box.style.margin = 5 +"px";
cont.appendChild(box);
box.style.color = "white";
var p = document.createTextNode( x+" x "+y);
cont.appendChild(p);
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
    h4.innerText= ("Ответ: размер: "+x+" x "+y);
}
    
    