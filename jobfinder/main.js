console.log('Hello World!');

class user {
 constructor(id, name, job, friends) {
  this.id = id;
  this.name = name;
  this.job = job;
  this.friends = friends;
 }
 getinfo(info = JSON.stringify([this.id, this.name, this.job, this.friends])) {
  console.log(info);
  return info;
 }
}
//вспомогательные компоненты
var inform = {
 mass: {},
 names: {},
 stack: [],
 startuser: 0,
 success: false,
 addstack(id) {
  console.log("попытка добавить стак и олд", inform.stack,"---",inform.old)
  if (!inform.old.includes(id)) {
   inform.stack.push(id);
   inform.old.push(id);
   console.log("add val to stack* old:", inform.old, "stack:", inform.stack)
  }
 },
 old: [],
 box: document.querySelector("#box"),
 input: document.querySelector("#input"),
 //получить все данные
 getall(obj = JSON.stringify(this.mass)) {
  console.log(obj);
  return obj;
 },
 //обработчик событий
 boxstart: (function() {
  window.onload = () =>
   inform.inner("Все пользователи:\n" + inform.getall())
  this.input.oninput = () => {
   finder.write(this.input.value.toLowerCase());
   if (this.input.value === "") {
    inform.inner("Все пользователи:\n" + inform.getall())
   }
  }
 })(),
 //считывание текста
 val(text) {
  inform.inner(text)
 },
 //вставка текста
 inner(text) {
  this.box.innerHTML = text;
 }
}
//вспомогательные методы
function pers(id, name, job, fr) {
 return new user(id, name, job, fr);
}

function add(id, name, job, fr) {
 inform.names[id] = name;
 inform.mass[id] = pers(id, name, job, fr)
}
//allUsers
add(1, "stepan", "driver", [2, 3, 4, 5]);
add(2, "alice", "bussiness", [1, 2, 3, 6]);
add(4, "egor", "school", [1, 2, 7, 8]);
add(3, "kirill", "weiter", [1, 2, 4, 8]);
add(5, "mike", "jumper", [1, 3, 9]);
add(6, "nik", "speaker", [2, 7, 8]);
add(8, "jon", "teacher", [4, 3, 9]);
add(7, "sam", "sceinser", [4, 6, 9, 10]);
add(9, "dima", "driver", [5, 8, 7]);
add(10, "doni", "bussiness", [7]);

//основные компоненты поиска
var finder = {
 write(val) {
  for (var id in inform.names) {
   if (inform.names[id].includes(val)) {
    inform.startuser = id;
    console.log("now Id new",id);
    finder.lookjob(id);
    return;
   }
   else {
    inform.inner("Пользователь не найден");
    inform.success = false;
   }
  }
 },
 lookjob(id) {
  inform.addstack(id);
  try{
   while (!finder.complete()) {
    if(inform.stack.length==0){
     inform.success=true;
     finder.complete();
     inform.inner("Совпадений не найдено")
     return 0;
    }
    var nowId = inform.stack.shift();
    if (nowId != inform.startuser) {
     if (inform.mass[nowId].job === inform.mass[inform.startuser].job) {
      console.log(nowId, "Complete!")
      inform.success = true;
      finder.display(
       inform.mass[inform.startuser]["name"],
       inform.mass[inform.startuser]["id"],
       inform.mass[nowId]["name"],
       inform.mass[nowId]["id"],
       inform.mass[inform.startuser]["job"]
      );
      finder.complete();
      return 0;
     }
     else {
      console.log(nowId, "не подходит")
     }
    }
    console.log(id, nowId, inform.startuser);
    inform.mass[nowId]["friends"].map((el) => {
     console.log(el, "добавляю");
     inform.addstack(el);
    })
   }
  }
   catch(e){
    console.log(e)
    finder.success=true;
   }
  
  
 },
 complete() {
  if (inform.success === true) {
   inform.old = [];
   inform.stack = [];
   inform.success = false;
   return true;
  }
  else {
   return false
  }
 },
 display(name1, id1, name2, id2, job) {
  inform.inner(`Результат поиска: <br/>У пользователя <span>${name1}</span> с id:<span>${id1}</span> <br/>Ближайший человек с местом работы <span>${job}</span>:<br/><span>${name2}</span> с id:<span>${id2}</span>.`)
 }
}