/* import React from 'react';

import ReactDOM from 'react-dom';
*/
import Tip from "./Tip.js";
import User from "./User.js";
import Comment from "./Comment.js";
import Film from "./Film.js";


const you = "1";
var nowstate = "start";

const states = {};
const films = {};
const openmenu = document.querySelector("#openmenu");
const content = document.querySelector("#contentin");

$("li").click(() => {
 nowstate = event.target.id;
 setTimeout(() => {
  openmenu.click();
  console.log(nowstate);
  ontop()
 }, 200)
})


const addState = (name, state) => {
 states[name] = state
}

addState("start", new Tip("start", []))
var item = document.querySelectorAll("li")
item.forEach((el) => {
 addState(el.id, new Tip(el.id, []))
})

class Filmadd extends Film {
 constructor(id, name, time, tip, allot, rating, url) {
  super(id, name, time, tip, allot, rating, url)
  addtip(this);
  addfilms(this);
 }
}

function addtip(obj) {
 obj.tip.map((el) => {
  for (let tip in states) {
   if (el === tip) {
    states[tip].films.push(obj.id)
   }
  }
 })
}
function getstrtime(){
 return new Date().toLocaleString()
}

function addfilms(obj) {
 films[obj.id] = obj;
}
var id = 0
var ids = () => String(id++);

const NewFilmsAdd = (function() {
 new Filmadd(ids(),
  "Фантастическая четверка",
  89,
 ["boi", "trill"],
 [],
  7.2,
  "4.jpg");

 new Filmadd(ids(),
  "Пятая волна",
  124,
 ["melody", "trill"],
 [],
  7.0,
  "5vave.jpg");

 new Filmadd(ids(),
  "Живое",
  89,
 ["trill"],
 [],
  7.6,
  "alive.jpg");

 new Filmadd(ids(),
  "Ангелы и демоны",
  112,
  ["trill"],
  [],
  6.0,
  "aid.jpg");

 new Filmadd(ids(),
  "Апокалипсис",
  213,
    ["melody", "trill"],
    [],
  7.2,
  "apokal.jpg");

 new Filmadd(
  ids(),
  "Арн: рыцарь тамплиер",
  96,
      ["melody", "boi", "adventure"],
      [],
  5.3,
  "arn.jpg");

 new Filmadd(ids(),
  "Облачный атлас",
  104,
        ["adventure", "comedy"],
        [],
  8.1,
  "atlas.jpg");

 new Filmadd(ids(),
  "Аватар",
  132,
          ["boi", "trill", "adventure"],
          [],
  8.5,
  "avatar.jpg");

 new Filmadd(ids(),
  "Бармен",
  79,
    ["comedy", "adventure"],
    [],
  6.2,
  "barman.jpg");

 new Filmadd(ids(),
  "Бегущие в лабиринте",
  92,
      ["trill", "adventure"],
      [],
  7.3,
  "beg.jpg");


 new Filmadd(ids(),
  "Без меня",
  90,
        ["comedy"],
        [],
  7.0,
  "bez.jpg");



 new Filmadd(ids(),
  "Настоящий богатырь",
  107,
     ["adventure", "melody"],
     [],
  7.6,
  "bogatir.jpg");


 new Filmadd(ids(),
  "Черновик",
  72,
       ["trill", "melody"],
       [],
  5.1,
  "chernovik.jpg");

 new Filmadd(ids(),
  "Дивергент",
  57,
   ["boi", "trill", " melody"],
   [],
  7.7,
  "diver.jpg");



 new Filmadd(ids(),
  "Дом",
  84,
  ["comedy", "melody", "adventure"],
  [],
  6.6,
  "dom.jpg");



 new Filmadd(ids(),
  "Дом напротив",
  71,
  ["trill"],
  [],
  7.2,
  "domna.jpg");


 new Filmadd(ids(),
  "Фантом",
  80,
    ["melody", "trill"],
    [],
  4.0,
  "fantom.jpg");


 new Filmadd(ids(),
"Гений",
  69,
    ["adventure"],
    [],
  9.2,
  "geniy.jpg");


 new Filmadd(ids(),
  "Герой",
  85,
      ["comedy", "melody"],
      [],
  7.0,
  "geroy.jpg");


 new Filmadd(ids(),
  "Приведение",
  78,
     ["comedy", "adventure"],
     [],
  6.2,
  "ghost.jpg");


 new Filmadd(ids(),
  "Гоголь",
  84,
       ["adventure", "trill"],
       [],
  7.8,
  "gogol.jpg");

 new Filmadd(ids(),
  "Группа 7",
  65,
         ["boi", "trill"],
         [],
  6.2,
  "gruppa.jpg");


 new Filmadd(ids(),
  "Черное сердце",
  89,
    ["adventure"],
    [],
  7.9,
  "heart.jpg");

 new Filmadd(ids(),
  "Однажды в голивуде",
  95,
      ["comedy", "adventure"],
      [],
  8.8,
  "holiv.jpg");

 new Filmadd(ids(),
  "Искупление",
  137,
        ["melody"],
        [],
  7.0,
  "iscup.jpg");

 new Filmadd(ids(),
  "Излом времени",
  87,
 ["adventure", "trill"],
 [],
  6.2,
  "izlom.jpeg");

 new Filmadd(ids(),
  "Во имя короля",
  89,
 ["boi", "trill"],
 [],
  6.0,
  "king.jpg");

 new Filmadd(ids(),
  "Рубиновая книга",
  110,
 ["adventure", "melody"],
 [],
  7.9,
  "knig.jpg");

 new Filmadd(ids(),
  "Коробка",
  75,
  ["boi", "comedy"],
  [],
  6.8,
  "korobka.jpeg");

 new Filmadd(ids(),
  "Ледокол",
  74,
    ["trill", "adventure", "melody"],
    [],
  7.0,
  "ledocol.jpg");

 new Filmadd(ids(),
  "Марсианин",
  142,
      ["trill", "adventure", "melody"],
      [],
  9.1,
  "mars.jpg");

 new Filmadd(ids(),
  "Матч",
  79,
        ["comedy", "melody"],
        [],
  5.2,
  "math.jpg");

 new Filmadd(ids(),
  "Семейное ограбление",
  71,
          ["comefy", "melody"],
          [],
  7.9,
  "ograb.jpg");

 new Filmadd(ids(),
  "Отмель",
  94,
["trill"],
    [],
  8.0,
  "otmel.jpg");

 new Filmadd(ids(),
  "Последствия",
  98,
      ["melody", "trill"],
      [],
  7.0,
  "posleds.jpg");


 new Filmadd(ids(),
  "Ремпейдж",
  99,
        ["boi", "adventure", "trill"],
        [],
  7.9,
  "rempage.jpg");



 new Filmadd(ids(),
  "Комната",
  102,
     ["melody", "adventure"],
     [],
  6.9,
  "room.jpg");


 new Filmadd(ids(),
  "Ужастики",
  98,
       ["trill", "adventure"],
       [],
  8.2,
  "scary.jpg");

 new Filmadd(ids(),
  "Секретный агент",
  91,
   ["boi", "trill"],
   [],
  7.2,
  "secr.jpg");



 new Filmadd(ids(),
  "Селфи",
  87,
  ["melody", "trill"],
  [],
  7.5,
  "self.jpg");



 new Filmadd(ids(),
  "Бегущий",
  97,
  ["boi", "trill", "melody"],
  [],
  6.2,
  "stolen.jpg");


 new Filmadd(ids(),
  "Свет в океане",
  88,
    ["melody"],
    [],
  7.8,
  "svet.jpg");


 new Filmadd(ids(),
  "Затерянный город Z",
  89,
    ["adventure", "melody"],
    [],
  5.2,
  "syty2.jpg");


 new Filmadd(ids(),
  "Холодное танго",
  99,
      ["melody", "trill", " comedy"],
      [],
  7.6,
  "tango.jpg");


 new Filmadd(ids(),
  "Тарас Бульба",
  79,
     ["melody", "trill"],
     [],
  6.9,
  "taras.jpg");


 new Filmadd(ids(),
  "Точка невозврата",
  78,
       ["boi", "trill"],
       [],
  7.2,
  "toch.jpg");

 new Filmadd(ids(),
  "Война миров",
  76,
         ["adventure", "trill"],
         [],
  7.4,
  "voina.jpeg");


 new Filmadd(ids(),
  "Волна",
  85,
    ["melody", "trill"],
    [],
  7.9,
  "volna.jpg");

 new Filmadd(ids(),
  "Защитники",
  80,
      ["boi", "trill", "comedy"],
      [],
  7.7,
  "zas.jpg");

 new Filmadd(ids(),
  "Предупреждение зомби",
  81,
        ["melody", "trill", "adventure"],
        [],
  6.2,
  "zombie.jpg");
})();

//загрузка фильмов завершена //
const allcat = [];
for (let el in states) {
 allcat.push(el);
}
//виды сортировки
function getSort(){
 let select=document.querySelector("select");
 let num=select.options.selectedIndex;
 return String( select.options[num].value )
}

//films is loaded//
function Rend(el) {
 ReactDOM.render(
  el,
  content
 );
}
function RendMess(el){
 ReactDOM.render(
  el,
document.querySelector("#mess")
 );
}
 
function Filmboard(props) {
 var texts = "text-uppercase text-left";
 
 var mess=()=>{
 Swal.fire({
  showCloseButton: true,
  //showCancelButton: true,
  html:"<div id='mess'></div>",
  imageWidth: 400,
  imageHeight: 200,
  imageAlt: 'Custom image',
  confirmButtonText:"Назад"
 })
 RendMess(<Filmobj num={props.id} />)
 }
//this.mess=mess;
 
 var ItFilm= (
  <div 
  id="filmboard"
 className="col m-auto mt-3 p-2"
 onClick={mess}
 >
  
  <div id="imgs" className="m-auto d-flex justify-content-center">
  <div>
   <img id="selfimgs" src={"films/"+props.film.url} 
   alt={props.film.name} 
   />
   </div>
  </div>
  
  <div id="names">
   <h4 className="text-center">{props.film.name}</h4>

  
  <div id="ratings">
   <p 
   className={texts}>{"Рейтинг "+ props.film.rating}</p>
   <p
   className={texts}>{props.film.time+" мин"}</p>
   </div>
  </div>
   
 </div>)
 return ItFilm
}

function Category(props) {
 var Sort=props.sort;
 console.log(Sort)
 //пересортировка списка
 props.obj.films.sort((a,b)=>{
  if(Sort==1){
    if(films[a].name>films[b].name){
    return 1;
    }else {
    return -1;
    }
  }
  if(Sort==2){
    return films[b].rating-films[a].rating
  }
  if(Sort==3){
    return films[a].time-films[b].time
  }
  if(Sort==4){
   let R=Math.round(Math.random()-1);
   console.log(R)
   return R;
  }
 })
 
 if(Sort==5){
  props.obj.films.reverse();
 }
 return (
  <div id="allfilms">
  <h2 id="catTitle">
  {"Категория "+getCategory(props.obj.title)}
  </h2>
  {
   props.obj.films.map((filmObj,i)=>
  <Filmboard id={filmObj} key={i} film={films[filmObj]}/>
  )
  }
  </div>
 )
}

function Start(props) {
 return (
  <div >
   {
    allcat.map((cat,i)=>{
     if(cat==="start"){
      
     }else{
      return (<div key={i}>
      <div id="headercat">
       <h3>{getCategory(cat)}</h3>
       </div>
       <div id = "catstart"
       className = "d-flex flex-nowrap overflow-auto">
       {states[cat].films.map((num,n)=>{
        return <Filmboard id={num} key={n} 
        film={films[num]}/>
       })}
       </div>
       </div>
       )
     }
    })
   }
  </div>
 )
}

function Filmobj(props){
 var obj=films[props.num]
 return <div id="film-message" 
 className="text-center m-auto">
   <h3>{obj.name}</h3>
   <div id="img-obj">
    <img id="selfimg-obj" src={"films/"+obj.url} 
    alt={obj.name} width="150"/>
   </div>
   <cite>Рейтинг: <strong>{obj.rating}</strong> <br/>Длительность: <strong>{obj.time}</strong>мин</cite>
   <h4>Оставьте отзыв</h4>

   <textarea className="form-control" id="textarea" rows="3"></textarea>

   <button
   type="button" className="btn btn-primary btn-lg btn-block"
   onClick={()=>{
     var val=document.querySelector("#textarea").value;
     obj.allot.push({
      dlit:getstrtime(),
      text:val
     });
     $("#textarea").val("");
     RendMess(<Filmobj num={props.num} />)
     //обновление объекта внутри
   }} >Отправить</button>
   <div id="comments" className="text-left d-flex flex-column-reverse">
   {obj.allot.map((obt,i)=>{
    return(<div key={i}>
    <hr/>
     <h4 >{obt.text}</h4>
     <label>{obt.dlit}</label>
     <hr/>
     </div>
     )
   })}
   </div>
 </div>
}

//Основной компонент приложения
class App extends React.Component {
 States = {
  now: "start",
  sort:getSort(),
  //filmlook:null
 }
 
 
 componentWillUpdate(){
  addspin("d-flex")
 }
 componentDidUpdate(prevProps) {
  if(true)/*prevProps.myProps !== this.props.myProp) */{
    //addsearch("d-none","d-block","d-none","d-none");
    addspin("d-none")
  }
}

 geton = (() => {
  $("li").click(() => {
   this.States.now = nowstate;
   this.newstate({now:nowstate});
   this.States.nowfilm = null;
  });
 $("select").change(()=>{
  this.States.sort=getSort();
  this.newstate({sort:getSort()});
  addsearch("d-none","d-block","d-none");
 })
 })()

 newstate(obj) {
  if (this.States.now !== states) {
   this.setState(obj);
   console.log(this.States.now, "now")
  }
 }
 
 render() {
  if (this.States.now !== "start") {
   addsearch("d-none", "d-block", "d-none")
   return <Category 
   sort={this.States.sort}
   obj={states[this.States.now]}/>
  } else {
   addsearch("d-none", "d-none")
   return <div>
   <h3>{"Лучшие фильмы на "}<span id="fru">F.ru</span>
   </h3>
   <Start/>
   </div>
  }
 }
}
Rend(<App/>)

//отобразить основные хэши
console.log(JSON.stringify(states))
console.log(JSON.stringify(films))


function ontop() {
 $("html,body").animate({
  scrollTop: 0
 })
}
ontop();
//Событие поиска фильмов

function addsearch(onf, ons, onb = "d-block") {
 $("#forms").attr("class", onf)
 $("#select").attr("class", ons)
 $("#button").attr("class", onb)
 
 var availableTags = [];
 for (var f in films) {
  availableTags.push(films[f].name)
 }
 $("#tags").autocomplete({
  source: availableTags
 });
}
function addspin(onl){
 $("#spins").attr("class",`fixed-top ${onl} justify-content-center`)
}

addsearch("d-none", "d-none")
addspin("d-none")

$("#button").click(() => {
 ontop();
 addsearch("d-block", "d-none")
 setTimeout(() =>
  $("#tags").focus(), 1000)

})


function getCategory(n) {
 if (n === "boi") return "Боевики";
 if (n === "trill") return "Триллеры";
 if (n === "comedy") return "Комедии";
 if (n === "melody") return "Мелодрамы";
 if (n === "adventure") return "Путешествия";
 return ("Все фильмы");
}

//событие поиска
$("#search-btn").click(()=>{
let val=$("#tags").val();
for(let el in films){
 if(films[el].name===val){
  
 Swal.fire({
  showCloseButton: true,
  //showCancelButton: true,
  html:"<div id='mess'></div>",
  imageWidth: 400,
  imageHeight: 200,
  imageAlt: 'Custom image',
  confirmButtonText:"Назад"
 })
 
  console.log(el)
  RendMess(<Filmobj num={el} />)
  return
 }
}

})
