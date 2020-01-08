console.log('Hello World!');
//переменные
var getid=(value)=>{
  return document.getElementById(value);
}
var getcl=(value)=>{
  return document.getElementsByClassName(value)[0];
}

var add = getid("add");
var gr = getid("gr");
var setting = getid("setting");
var user_new_btn = getid("user_new_btn");
var user_set_btn = getid("user_set_btn");
var menu=getid("menu");


var menu_page = getcl("menu_page");
var add_page = getcl("add_page");
var gr_page = getcl("gr_page");
var setting_page = getcl("setting_page");
var add_user = getcl("add_user");
var set_user = getcl("set_user");
var add_w = getid("add_w");
var add_hesh = getid("add_hesh");

var none=(el)=>{
  el.style.display="none";
}
var block=(el)=>{
  el.style.display="block";
}
var menu_none=(el1,el2,el3)=>{
  none(menu_page);
  none(gr_page);
  none(setting_page);
  none(add_page);
  none(add_user);
  none(set_user);
  
  if(el1)block(el1);
  if(el2)block(el2);
  if(el3)block(el3);
}

var now_user=localStorage.getItem("now_user");
//события
menu.onclick=()=>{
  menu_none(menu_page);
}
add.onclick=()=>{
  if(!now_user){
    pushapF("добавьте пользователя");
    menu_none(add_user);
  }
  else menu_none(add_page);
}
gr.onclick=()=>{
  create_user_list();
  if (!now_user) {
    pushapF("добавьте пользователя");
    menu_none(add_user);
  }
  else {
   menu_none(gr_page);
   create_weights_list();
  }
}
setting.onclick=()=>{
  menu_none(setting_page);
}
user_new_btn.onclick=()=>{
   menu_none(add_user);
}
user_set_btn.onclick=()=>{
  if (!now_user) {
    pushapF("добавьте пользователя");
    menu_none(add_user);
  }
  else {
  menu_none(set_user);
  create_user_list();
  }
}
add_w.onclick=()=>{
  if(!lens(input_weight))return ;
  create_user_list();
  menu_none(gr_page);
  var date=new Date();
  add_weight (input_weight.value,date);
  create_weights_list();
  input_weight.value="";
  
}
add_hesh.onclick=()=>{
  add_user_func(input_name);
  menu_none(menu_page);
}

///пользователь///*****************
//начальная страница условие
menu_none(menu_page);

//переменные
var input_name = getid("name");
var input_weight = getid("weight");
 var user_box = getcl("user_box");
 var user_weights = getcl("user_weights");
 
 var lens=(el)=>{
   if(el.value==="")return false;
   else return true;
 };
 
 if(!Sget("pers")){//восстановить обьект
var pers={};
console.log("new pers list");
Sset("pers",json(pers));
}
else{
  var pers=par(Sget("pers"));
  console.log
}

if(!Sget("pers_objs")){//восстановить массив
  var pers_objs=[];
  Sset("pers_objs",json(pers_objs));
}
else{
  var pers_objs=par(Sget("pers_objs"));
};
//добавить юзера в память их количество
var num_obj=0;
if(Sget("num_obj"))num_obj=Sget("num_obj");console.log(num_obj,"num obj");

var now_number=pers[now_user];

function add_user_func(input){
  if(!lens(input))return;
  //добавить в объект
  
  pers[input.value]=num_obj++;
  Sset("num_obj",num_obj);
  //now change json_pers::::
  pers_objs.push({
    [input.value]:{
      props:{
        weis:[],
        days:[]
      }
    }
  });
  Sset("pers_objs",json(pers_objs));
  console.log(json(pers_objs));
  //
  ///////////
   jpers_ob=json(pers);
  Sset("pers",jpers_ob);
  console.log(json(pers));
  pushapF("Hello user: "+input.value);
  Sset("now_user",input.value);
  now_user=input.value;
  now_number=pers[now_user];
  
  input.value="";
}
//методы json 
function json(ob){
  return JSON.stringify(ob);
}
function par(ob){
  return JSON.parse(ob);
}
function Sset(key,val){
  return localStorage.setItem(key,val);
}
function Sget(val){
  return localStorage.getItem(val);
}

//список юзеров
function create_user_list(){
  user_box.innerText="";
  var num=0;
  for(var name in pers){
  var list=document.createElement("div");
  list_click(list,name,num);
  num++;
  }
}
//функция клика по выбору юзера
function list_click(list,name,num){
  list.innerText = `${num+1}. ${name}`;
  list.className = "line";
  list.onclick=()=>{
    now_user=name;
    pushapF("Hello user: "+now_user);
    now_number=pers[name];
    //obj_num=pers[name];
    //Sset("obj_num",obj_num);
    menu_none(menu_page);
  }
  user_box.appendChild(list);
}

//добавление измерения к юзеру
function add_weight(val, date){
  console.log(val,date);
  var now_date=`${zero(date.getHours())}.${zero(date.getMinutes())}/${zero(date.getDate())}.${zero(date.getMonth()+1)}.${date.getFullYear()}`;
  console.log(now_date);
  
  var obj_name=par(Sget("pers"));
  console.log(json(obj_name));
  var number=obj_name[now_user];
  console.log(number+" номер по списку");
  //получить
  var all_objs=par(Sget("pers_objs"));
  //изменить
  all_objs[number][now_user].props.weis.push(val);
  all_objs[number][now_user].props.days.push(String(now_date));
  //записать
  Sset("pers_objs",json(all_objs));
  
  console.log(json(all_objs));
}
//развернуть список пользователя весы даты
function create_weights_list(){
  user_weights.innerText="";
  console.log("list weight look");
  var str=document.createElement("ul");
  
  var us_ws=par(Sget("pers_objs"))[now_number][now_user].props.weis;
  var us_ds=par(Sget("pers_objs"))[now_number][now_user].props.days;
  
  for(var w=0;w<us_ws.length;w++){
  var li=document.createElement("li");
  str.appendChild(li);
  li.innerText=`${us_ws[w]}кг  ${us_ds[w]}`;
  }
  user_weights.appendChild(str)
  
}


//******************//система программы
//очистить кеш//
var clear=getid("clear");
clear.onclick=()=>{
  localStorage.clear();
  console.log("clear");
  window.location=location;
}


//функция уведомления
var pushap=getcl("pushap");
var pushap_text=getcl("pixel");
pushap.style.opacity=0;
pushap.style.display="none";

function pushapF(text){
  var op=0;
  pushap.style.display="block";
  pushap_text.innerText=text;
 var t= setInterval(function(){
   pushap.style.opacity=op;
   op+=0.02;
   if(op>=1){
     clearInterval(t);
     var t2= setInterval(function (){
       pushap.style.opacity=op;
       op-=0.05;
       if(op<=0){
         clearInterval(t2);
         pushap.style.display="none";
         console.log("pushap: "+text);
       }
     },50)
   }
 },40);
}

//добавить 0000;
function zero(num){
  if(String(num).length<2)return "0"+String(num);
  return String(num);
}