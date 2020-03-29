console.log('Hello World!');
//начальные установки динамики
const sel = document.querySelector("#sel"),
 tip = document.querySelector("#tip"),
 table = document.querySelector("#table");
const addComp = (el) => {
 el.contentEditable = true
}

function addBlock() {
 const blocks = document.querySelectorAll("td");
 for (var block of Object.keys(blocks)) {
  if (blocks[block].id != "not") {
   addComp(blocks[block])
   blocks[block].style.backgroundColor = getColor(blocks[block].innerText);
   blocks[block].onchange=(e)=>{
    Update(e.target)
   }
  };
 }
}

function Update(el){
 let {dat,nm,ls}=el.dataset;
 let num=el.innerText;
 
 console.log(dat,nm,ls)
 ParamsMass.map((par,i)=>{
  if(par.user==nm&&
  par.lesson==ls&&
  par.data==dat){
   par.number=num;
  }
 })
 Users.map((us,i)=>{
  if(us.name==name){
   us.param.map((par,j)=>{
    if(par.date==dat&&par.lesson==ls){
     par.number=num;
    }
   })
  }
 })
 
 setState();
}

function getColor(txt) {
 switch (txt) {
  case "5":
   return "lightgreen";
  case "4":
   return "green";
  case "3":
   return "orange";
  case "2":
   return "red";
  default:
   return "lightgrey";
 }
}
//данные о предмете из конструктора
const UsersMass = ["Вася", "Петя", "Женя", "Маша", "Катя", "Толик", "Алиса", "Настя", "Гоша", "Петр", "Алина", "Саша", "Роман", "Эрик", "Соня", "Дима", "Славик", "Федя", "Лиза", "Элис", "Тамара", "Зина", "Ефим"];
const LessonMass = [
 "mat", "en", "rus", "obj", "mir"
 ];
const Users = [],
 Lessons = [];
const state = {
 sel: "en",
 tip: "all"
};
function setState ()  {
 //сохранениеисостояния в кеш
 console.log(state);
 createTable(state);
 addBlock();
}
const ParamsMass = [];

class Lesson {
 constructor(name) {
  this.name = name;
  var mass = [];
  ParamsMass.map((el, i) => {
   if (el.lesson == name) {
    mass.push(el);
   }
  })
  this.mass = mass;
  Lessons.push(this)
 }
}
class Params {
 constructor(user, number, date, lesson) {
  this.number = number;
  this.date = date;
  this.user = user;
  this.lesson = lesson;
  ParamsMass.push(this);
 }
}
var id = 0;
class User {
 constructor(name, param) {
  this.name = name;
  var param = [];
  ParamsMass.map((el, i) => {
   if (el.user == name) {
    param.push(el);
   }
  });
  var itogs = {},
   itog = {};
  for (var les of LessonMass) {
   itogs[les] = [];
   itog[les] = 0;
  }
  ParamsMass.map((par, i) => {
   if (par.user == name) {
    itogs[par.lesson].push(par.number)
   }
  })
  Object.keys(itogs).map((el, i) => {
   var sum = 0;
   itogs[el].map((els, i, mas) => {
    if (Number(els)) {
     sum += Number(els)
    }
    itog[el] = (sum / mas.length).toFixed(2);
   })
  })

  this.param = param;
  this.itogs = itogs;
  this.itog = itog;
  this.id = id++;
  Users.push(this);
 }
}
//рандомное заполнение данных и сохранение в памяти.
//итог предметы распределены по датам
//созданы массивы юзеров, уроков и общих параметров, но основе этого создать функции получения таблиц
const addAllUs = (...us) => {
 LessonMass.forEach((les) => {
  var lesson = les;
  for (let j = 1; j < 33; j++) {
   for (let us of UsersMass) {
    let R1 = Math.random();
    let R = R1 > 0.2 ?
     Math.floor(Math.random() * 2) + 4 :
     Math.floor(Math.random() * 2) + 2;
    if (R1 < 0.08) {
     R = "Н"
    }
    new Params(us, String(R), j, lesson);
   }
  }
 })
 us.forEach((el) => {
  new User(el);
 });
 LessonMass.forEach((el) => {
  new Lesson(el);
 })
}
addAllUs(...UsersMass);

//Изменение состояния dom;
UsersMass.map((el, i) => {
 var opt = document.createElement("option");
 opt.setAttribute("name", el);
 opt.innerText = el;
 tip.appendChild(opt)
});
//назначение событий
tip.onchange = (e) => {
 var ind = tip.selectedIndex;
 var val = (tip.options[ind].getAttribute("name"));
 console.log(val)
 state.tip = val;
 setState();
}
sel.onchange = (e) => {
 var ind = sel.selectedIndex;
 var val = sel.options[ind].getAttribute("name");
 console.log(val)
 state.sel = val;
 setState()
}

//функция создания таблицы на основе состояния , вызываемая из setState
function createTable({ sel: les, tip: type }) {
 if (state.tip == "all") {
  sel.className = "";
  var rez = "";
  rez += `<caption>Общая статистика класса по предмету ${getLes(state.sel)}</caption>`
  Users.map((us, i) => {
   var data = "";
   if (i == 0) {
    var ram = "";
    for (let j = 0; j < 32; j++) {
     ram += `<td id="not">${j==0?"":j}</td>`
     if (j == 31) {
      ram += `<td id="not">Итог:</td>`
     }
    }
    var dats = `<tr>${ram}</tr>`
    rez += dats;
   }
   for (var j = 0; j < 32; j++) {
    var txt = "";
    if (j == 1) {
     txt = `<td id="not">${us.name}</td>`
    } else {
     if (j != 0) {
      ParamsMass.map((par) => {
       if (par.date == j &&
        par.lesson == les &&
        par.user == us.name) {
        txt = `<td data-dat="${j-1}" data-nm="${us.name}" data-ls="${state.sel}">${par.number}</td>`
       }
      })
     }
    }
    if (j == 31) {
     txt += `<td></td><td id="not">${us.itog[state.sel]}</td>`
    }
    data += txt;
   }
   //if(i!=0)
   // data+="<td></td>"
   rez += `<tr>${data}</tr>`
  })
  table.innerHTML = rez;
 } else {
  sel.className = "nones";
  table.innerHTML = "";
  var rez = "";
  rez += `<caption>Статистика для ученика ${state.tip} по всем предметам</caption>`
  LessonMass.map((el, i) => {
   var data = "";
   if (i == 0) {
    var ram = "";
    for (let j = 0; j < 32; j++) {
     ram += `<td id="not">${j==0?"":j}</td>`
     if (j == 31) {
      ram += `<td id="not">Итог:</td>`
     }
    }
    var dats = `<tr>${ram}</tr>`
    rez += dats;
   }

   for (var j = 1; j < 32; j++) {
    var txt = "";
    if (j == 1) {
     txt = `<td id="not">${getLes(el)}</td>`
    }
    if (j != 1) {
     ParamsMass.map((par) => {
      if (par.date == j &&
       par.user == state.tip &&
       par.lesson == el) {
       txt = `<td data-dat="${j-1}" data-nm="${state.tip}" data-ls="${el}" >${par.number}</td>`;
      }

     })
    }
    if (j == 31) {
     var it = "";
     Users.map((us) => {
      if (us.name == state.tip) {
       it = us.itog[el]
       console.log(it)
      }
     })
     txt += `<td></td><td id="not">${it}</td>`
    }
    data += txt;
   }
   rez += `<tr>${data}</tr>`
  })
  table.innerHTML = rez;
 }
}
setState()

function getLes(abr) {
 switch (abr) {
  case "en":
   return "Английский язык";
  case "rus":
   return "Русский язык";
  case "obj":
   return "ОБЖ";
  case "mir":
   return "Окружающий мир";
  case "mat":
   return " Математика";
  default:
   return "Ошибка предмета"
 }
}

//код вычисления средних значений при инициализации пользователей

//код события изменения и сохранения значений столбцов в память и инициализацию объекта состояния