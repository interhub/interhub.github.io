console.log('Hello World!');
var id=Number(localStorage.getItem("i"))||0;

window.ondblclick=()=>{
// localStorage.clear()
 console.log("ram clear")
}


const state={
 nowId:localStorage.getItem("nowId")||"0",
 now:localStorage.getItem("now")||"logout",
 register:document.querySelector(".register"),
 login:document.querySelector(".in"),
 out:document.querySelector(".out"),
 messages:document.querySelector(".messages"),
 display:document.querySelector(".display"),
 exite:(()=>{
  document.querySelector("#out")
  .addEventListener("click",()=>{
   state.now="logout";
   state.nowId=null;
   state.save();
  }) 
 })(),
 start:(()=>{
  setInterval(()=>{
   if(state.now=="logout"){
    state.register.style.display="block";
    state.login.style.display="block";
    state.out.style.display="none";
    state.messages.style.display="none";
   }else
   if(state.now=="login"){
    state.register.style.display="none";
    state.login.style.display="none";
    state.out.style.display="block";
    state.messages.style.display="block"
   }
  },100)
 })(),
 save(){
  localStorage.setItem("nowId",this.nowId);
  localStorage.setItem("now",this.now)
 }
}

const inform={
 database:JSON.parse(localStorage.getItem("database"))||{},
 wall:JSON.parse(localStorage.getItem("wall"))||[],
 add(obj,id){
  this.database[id]=obj;
  console.log("database state=",JSON.stringify(this.database))
  localStorage.setItem("database",JSON.stringify(inform.database))
  //добавить в стор
 },
 addMess(obj){
  this.wall.push(obj)
  localStorage.setItem("wall",JSON.stringify(inform.wall))
 }
}

class Message{
 constructor(id,text){
  this.id=id;
  this.text=text;
  this.date=new Date().toLocaleString();
  inform.addMess(this)
  console.log("send new Mess:",JSON.stringify(this))
 }
}

class User{
 constructor(name,login,pass,date){
  let itId=String(id++);
  localStorage.setItem("i",id);
  this.id=itId;
  this.name=name;
  this.login=login;
  this.pass=pass;
  this.date=date;
  this.messages=[];
  inform.add(this,itId)
  console.log("create new User",JSON.stringify(this))
 }
}

const registrator={
 names:document.querySelector("#names"),
 login:document.querySelector("#login"),
 pass:document.querySelector("#pass"),
 date:document.querySelector("#date"),
 btn:document.querySelector("#btn"),
 form:[this.names,this.login,this.pass,this.date],
 startSet:(()=>{
  var y=new Date().getFullYear(),
      m=new Date().getMonth()+1,
      d=new Date().getDate()
  const addZero=(num)=>
   num.length>1?
   num:"0"+num;
  this.date.value=(`${y}-${addZero(m)}-${addZero(d)}`);
  this.btn.addEventListener("click",()=>registrator.regOn())
 })(),
 regOn:()=>{
  for(var pole of registrator.form){
  if(pole.value==""){
      return alert("Заполните все поля")
     }
  }
  console.log("new")
  var [names,login,pass,date]=registrator.form;
  new User(names.value,login.value,pass.value,date.value)
  for(let pole of registrator.form){
   pole.value=""
  }
  alert("Вы зарегистрировались, войдите в аккаунт")
 }
}


const author={
 login:document.querySelector("#login-in"),
 span:document.querySelector("#span-name"),
 forms:[],
 pass:document.querySelector("#password-in"),
 send:document.querySelector("#btn-in"),
 start:(()=>{
  window.onload=()=>{
   console.log("load author btn")
   author.forms=[author.login,author.pass],
  author.send
  .addEventListener("click",()=>{
   console.log("click send")
   author.analys()})
   if(inform.database[state.nowId]!=undefined){
   author.span.innerHTML=
   `${inform.database[state.nowId].name}`;}

  }
 })(),
 analys(){
  console.log("inn")
  for(let pole of author.forms){
   if(pole.value==""){
    return alert("Заполните все поля")
   }
  }
 for(let _id in inform.database){
  var us=inform.database[_id]
  if(us.login==author.login.value&&
     us.pass==author.pass.value){
      state.nowId=_id;
      state.now="login";
      state.save();
      for(let pole of author.forms){
      pole.value="";
     }
     author.span.innerHTML=`${us.name}`;

      return alert("Добрый день, "+us.name);
     }
 }
 return alert("Пользователь не найден")
 }
}

var Sender={
 texts:document.querySelector("textarea"),
 btns:document.querySelector("#btn-mess"),
 displays:document.querySelector(".display"),

 starts(){
  setTimeout(()=>{
   Sender.addDisplays();
   console.log("load diaplay");
   Sender.btns.onclick = () => {
     console.log("click send")
     var Id = state.nowId;
     var val = Sender.texts.value;
     if (val != "") {
      inform.database[Id].messages.push(new Message(Id, val));
      Sender.texts.value = "";
      Sender.addDisplays();
     }
   }
  },500)
 },
 addDisplays(){
  var all="";
  for(let mes of inform.wall){
   all=`<div><label><b>${inform.database[mes.id].name}<b/></label><br/> <cite>${mes.text}</cite> <br/>${mes.date}</div><hr/>`+all;
 }
 Sender.displays.innerHTML=all;
 state.save()
}
}
Sender.starts()