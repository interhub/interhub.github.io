console.log('Hello World!');

var state={
 day:1,
 days:{
  
 }
}

const addDinamyc=(()=>{
 $("#date").text("День "+state.day)
 $("#range").on("input",()=>{
  $("#weather").text($("#range").val())
 })
 $("#val").on("input",()=>{
  $("#col").text($("#val").val()+" шт.")
 })
 $("#text").hide();
 $("#add").click(()=>{
  $("#text").show();
 })
 $("#prognoz").one("click",()=>{
  if(state.day<5){
   alert("Добавьте данные минимум на 4 дня")
  }
 })
 $("#prognoz").click(()=>{
  if(!state.days[state.day]){
   return alert("Добавьте данные для этого дня")
  }
  if(state.day>4){
  getPrognoz();
  }
 })
 $("#new").click(()=>{
  add();
  $("#text").hide();
  alert("Добавлено")
 })
 $("#next").click(()=>{
  if(state.days[state.day]){
  $("#date").text("День "+(++state.day))
  }else{
   return alert("Добавьте данные")
  }
 })
 $("#prev").click(()=>{
  state.day--;
  state.day<1?
  state.day=1:
  state.day+=0;
  $("#date").text("День "+(state.day))
 })
 $("#next").one("click",()=>{
  $("#display").text("")
 })
 $("#display").text("Внесите данные минимум на 4 дня")
})()

class Day{
 constructor(day,vals,tovars){
  this.day=day;
  this.vals=vals;
  this.tovars=tovars;
  console.log(state)
 }
}

function add(){
 state.days[String(state.day)]=new Day(Number(state.day),
 [
  Number($("#range").val()),
 $("#week:checked").val()=="on"?
 1:0,
 $("#prad:checked").val()=="on"?
 1:0
 ],
  Number($("#val").val()))
 }

function getPrognoz(){
 var k=4,arr=[],ram=[];
 let {days}=state,
 now=days[state.day];
 for(var day in days){
   ram.push({
    day,
    delta:
    Math.floor
    (Math.sqrt
    (Math.pow(days[day].vals[0]-now.vals[0],2)+
    Math.pow(days[day].vals[1]-now.vals[1],2)+
    Math.pow(days[day].vals[2]-now.vals[2],2)),2)
   })
 }
 arr=ram.sort((a,b)=>
  a.delta-b.delta
 )
 //объект с данными о ближайших k соседях
 arr=arr.splice(0,k+1);
 //расчет среднего ариф для ближайших объектов
 var sum=0;
 arr.map((el)=>{
  if(el.day!=state.day){
  sum+=days[el.day].tovars
  }
 })
var otv=Math.ceil(sum/arr.length-1);
 return alert("Прогноз на День "+state.day+" равно "+otv+" единиц товара")
}

