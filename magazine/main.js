console.log('Hello Word!');

var shop=document.querySelector("#shop");
function shopdisplay(obj,sum){
 var text=""
 text+=`<b>Итог: ${sum}₽</b><br><hr><br>`;
 Object.keys(obj).map((id)=>{
  console.log(id)
  text+=`${inform.shop[id].name}: ${inform.shop[id].price}₽ * ${inform.shop[id].mass}шт. = ${inform.shop[id].allprice}₽.<br><br>`;
 });
 shop.innerHTML=text;
}

const inform = {
 addObj(id, obj) {
  inform.allbue[id] = obj;
 },
 addDisp(id, obj, yes) {
  if (yes) {
   const box = document.getElementById("catalog");
   var tovar = document.createElement("div");
   tovar.id = "tovar";
   var nameTovar = document.createElement("h3");
   tovar.appendChild(nameTovar);
   nameTovar.innerText = obj.name;

   var priceTovar = document.createElement("p");
   tovar.appendChild(priceTovar);
   priceTovar.innerText = obj.price+"₽";

   var btnadd = document.createElement("button");
   btnadd.onclick = () => {
    inform.addshop(id,obj);
    inform.shop[id].mass++;
    inform.shop[id].allprice=
    inform.shop[id].mass*
    inform.shop[id].price;
    let sum=inform.itogsum()
    
    shopdisplay(inform.shop,sum)
    console.log("shop", JSON.stringify(inform.shop))
   }
   btnadd.innerText = "Добавить в корзину"
   tovar.appendChild(btnadd)
   box.appendChild(tovar);
  }
 },
 allbue: {},
 addshop(id, obj) {
  inform.shop[id] = obj;
 },
 shop: {},
 itogsum(sum=0){
  for(var i in inform.shop){
   sum+=inform.shop[i].allprice;
  }
  console.log("itog",sum)
  return sum;
 }
}

class Tovar {
 constructor(id, name, price, mass, allprice) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.mass = 0;
  this.allprice = this.mass * this.price;

  inform.addObj(this.id, this);
  inform.addDisp(this.id, this, true);
 }
}


new Tovar("1", "banana", "80");
new Tovar("2", "apple", "56");
new Tovar("3", "chips", "120")
new Tovar("4", "meet", "120")
new Tovar("5", "salt", " 54")
new Tovar("6","cake", "96")
new Tovar("7", "cola", " 77")
new Tovar("8", "chocolate"," 115")
new Tovar("9", "ketchup", " 84")
new Tovar("10","edges", "65")
new Tovar("11", "snickers"," 68")
new Tovar("12", "milk"," 45")
new Tovar("13", "popcorn","85")
var ids=14;
var inputself={
 name:document.getElementById("nameNew"),
 price:document.getElementById("price"),
 btn:document.getElementById("btnnew"),
 add(){
  this.btn.onclick=()=>{
  if(this.name.value||this.price.value){
   new Tovar(String(ids++),
   this.name.value,
   this.price.value)
   
  }
  }
 }
}
inputself.add();








