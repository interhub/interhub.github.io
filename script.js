var input = document.getElementById("input");
var input_text = document.getElementById("input_name");
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
    find_num(input.value, input_text.value)
})
//начальные условия
container.style.display = "none";


//функции
function iner(){
display_block ();
    btn.innerText= "Готово";

    }

function set(){
    //функция добавления
   new_item(input.value, input_text.value);
    display_none();
  btn.innerText = "Добавить номер";
}


function new_item(phone, name){
    var row= document.createElement("div");
    box.appendChild(row);
    if((input.value==="")&&(input_text.value===""))return 0;
    
    mass[x]=document.createElement("p");
    mass[x].innerText =name+" - "+phone;
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

