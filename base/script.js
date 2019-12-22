var input = document.getElementById("input");
var input_text = document.getElementById("input_name");
var clear = document.getElementById("clear");
var box = document.getElementById("box");
var btn = document.getElementById("btn");
var find = document.getElementById("find");
var dell = document.getElementById("dell");
var container = document.getElementById("container");
var num=2;
var x=0;
var num_find=0;
var mass= new Array();
var table= new Array();
//события
clear.onclick=empty;
btn.onclick=plus;
function plus(){
    num++;
    if(num%2==0){
    set();
    }
else{
    iner();
}
}
dell.onclick= dell_value;
find.addEventListener("click", function(){
    find_num(input.value, input_text.value);
}
);
//начальные условия
container.style.display = "none";



//функции
function empty(){
  localStorage.clear(); 
location.reload();  
}


window.onload=start;
function start(){
  if(localStorage.getItem("raz")>0){
   var raz= localStorage.getItem("raz");
//localStorage.clear();
  var n= localStorage.getItem("raz");
  n++;
  var i=0;
   while (i<n){
     new_item(
       localStorage.getItem(
         localStorage.getItem(i))
       , localStorage.getItem(i));
       i++;
   }
  }
}

function iner(){
display_block ();
    btn.innerText= "Готово";
    }

function set(){
  add_ram(input.value, input_text.value, x);
    //функция добавления
   new_item(input.value, input_text.value);
    display_none();
  btn.innerText = "Добавить номер";
}


function new_item(phone, name){
  
    var row= document.createElement("ul");
    box.appendChild(row);
    if((input.value==="")&&(input_text.value===""))return 0;
    
    mass[x]=document.createElement("li");
    mass[x].innerText ="-"+name+" \n   "+phone;
   row.appendChild(mass[x]);
 row.className= "row";
    x++;
    table[name]=phone;
    
}

function find_num(phone, name){
    num_find++;
    container.style.display="flex";
    input.style.display="none";
    input.value="";
    input_text.placeholder= "введите имя";
    btn.style.display="none";
    find.style.display="block";
    find.innerText="Поиск";
    
    
    if(num_find==2){
        num_find=0;
        find.innerText="Найти номер";
        find.style.display="inline";
        btn.style.display="inline";
        input.style.display = "block";
        container.style.display="none";
        input_text.placeholder= "Имя";
        find_result(phone, name);
    }
}

function find_result(phone, name){
    if (name==="") alert("Введите имя");
    else if (!table[name]) alert("Контакт не найден");
    else if(table[name]) alert("Номер: "+table[name]);

}

function display_block(){
   container.style.display= "flex";
    find.style.display= " none";
}
function display_none(){
   container.style.display = "none";
    find.style.display= "inline";
}

function dell_value(){
    input.value="";
    input_text.value="";
    }

function add_ram(phone,name, x){
  localStorage.setItem(name, phone);
  localStorage.setItem(x, name);
  localStorage.setItem("raz", x);
}
