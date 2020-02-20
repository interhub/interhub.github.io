console.log('Hello World!');
const app = document.querySelector("#app")
var pos="";
if(localStorage.getItem("sum")){
var sum=localStorage.getItem("sum")
sum++;
localStorage.setItem("sum",sum)
}else{
 var sum=1;
 localStorage.setItem("sum",sum)
}
var click=0;
var cord="";
window.ontouchend=(evt)=>{
 click++
 var touches = evt.changedTouches;
        
  for (var i = 0; i < touches.length; i++) {
   cord=`<br/><b>${touches[i].pageX.toFixed(3)} x ${touches[i].pageY.toFixed(3)}</b>`
   }
}
var back=document.referrer;
setInterval(()=>{
var info = {
 br: navigator.userAgent,
 time: new Date().toLocaleTimeString(),
 date: new Date().toString(),
 pos:pos,
 onl:navigator.onLine,
 w:screen.width,
 h:screen.height,
 wb:window.innerWidth,
 hb:window.innerHeight,
 scroll:Math.round($(window).scrollTop()),
 back:back,
 sum:sum,
 click:click,
 cord:cord
}
var onl=(info.onl==true)?
"Online":"Offline";
 txt=`Информация о вашем браузере и устройстве:
 ${info.br.bold()} <br/>
 Системное время:
 ${info.time.bold()} <br/>
 Системная дата и пояс:
 ${info.date.bold()} <br/>
 Координаты местоположения:
 ${info.pos.bold()}
 Состояние сети: ${onl.bold()},
 Разрешение экрана устройства(пкс):
 ${info.w}x${info.h}
 Размеры окна браузера: 
 ${info.wb}x${info.hb}
 Расстояние прокрутки: <b>${info.scroll}</b> пкс
 Предыдущая страница браузера: ${info.back}
 Размер истории браузера: ${history.length}
 Количество посещений этой страницы: <b>${info.sum}</b> <br/>
  Количество кликов на странице: <b>${info.click}</b><br/>
  Координаты касания: ${info.cord}<button onclick='buffer()'>Получить содержимое буфера обмена</button>`
app.innerHTML= txt
},100);
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      pos=`LT ${lat}\nLN ${lng}`;
    });

function buffer (){
 
navigator.clipboard.readText().then(alert,alert)
}
