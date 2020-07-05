console.log('Hello World!');
if(localStorage.getItem("likes")){
 var likes=JSON.parse(localStorage.getItem("likes"))
}else{
var likes = {
 len: 0,
 objs: {},
 links: []
 }
 localStorage.setItem("none",JSON.stringify(likes))
}
function save(){
 localStorage.setItem("likes",JSON.stringify(likes))
}
const Card = (props) => {
 //var states=useState(false);
 var cat = props.name;
 return (
  <div className="card">
 <div className="img-block">
    <div id="download">
    <a href={props.obj.media.m+" download" }
     target="_blank"
    >Скачать</a>
    </div>
   <img className="img" 
    src={props.obj.media.m}
    title={props.obj.title}
    alt={"imgs"}/>
   </div>
   <div id="btns">
  <div className="btns btns-1" 
  onClick={()=>{
   $(".showInfo").children().slideToggle(500)
  }} > Подробнее о фотографии..</div>
  <div className="btns btns-2"
  id={likes.links.includes(props.obj.media.m)?"likes":""}
  onClick={(event)=>{
    if(event.target.id=="likes"){
     event.target.id=""
     var pos=likes.links.indexOf(props.obj.media.m);
     likes.links.splice(pos,1)
     likes.objs[cat]--;
     if(likes.objs[cat]==0){
      delete likes.objs[cat];
     }
     likes.len--;
     save();
     console.log(JSON.stringify(likes))
     //код добавления в рекомендации//
    }else{
     event.target.id="likes";
     console.log("ONlike");
     likes.links.push(props.obj.media.m)
     likes.objs[cat]?
     likes.objs[cat]++:
     likes.objs[cat]=1;
     likes.len++;
     save()
     console.log(JSON.stringify(likes))
    }
  }}
  >
  Лайк
  </div>
   </div>
   <div className="showInfo">
  <div className="info">
     <cite>{props.obj.title}</cite>
     <p><i dangerouslySetInnerHTML={{__html:"<div>"+remake(props.obj.description)+"</div>"}}>
     </i></p>
  </div>
 </div>
 </div>)
}


var proxy = "https://cors-proxy.htmldriven.com/?url=";



var tags = "animals architecture art asia australia autumn baby band barcelona beach berlin bike bird birds birthday black blackandwhite blue bw california canada canon car cat chicago china christmas church city family fashion festival film florida flower flowers food football france friends fun garden geotagged germany girl graffiti green halloween hawaii holiday house india kids la lake landscape light live london love macro me mexico model museum music nature new newyork newyorkcity night nikon nyc ocean old paris park party people photo photography photos portrait raw red river rock san sanfrancisco scotland sea seattle show sky snow spain spring square squareformat street summer sun sunset taiwan texas thailand tokyo travel tree trees trip uk unitedstates urban usa vacation vintage washington water wedding white winter woman yellow zoo clouds color concert dance day de dog england europe fall instagramapp iphone iphoneography island italia italy japan".split(" ").sort();


function display(name) {
 ontop()
 var url = `http://api.flickr.com/services/feeds/photos_public.gne?tags=${name}&format=json&nojsoncallback=1`;
 fetch(proxy + url)
  .then(data => { console.log(data); return data.text() })
  .then(es => {
   add(es, name);
  })
  .catch(console.error)
}



function add(objs, name) {
 objs = JSON.parse(objs);
 var Items = (<div>
  <button id="back" 
  onClick={()=>{
   Rend(<App/>)
  }}>Назад</button>
  <h2>Категория #{name}</h2>
  {objs.items.map((el,i)=>
   <Card obj={el} key={i} name={name}/>
  )} 
  </div>)
 Rend(Items)
}


function Names(props) {
 return (
  <div className="tags">
 <h2>Бесплатный онлайн фотосервис</h2>
 <h4>Выберете категорию</h4>
 <div id="rec" 
 onClick={()=>{
  ontop()
  if(likes.len>0){
  getLinksObj()
  }else{
   Rend(<Rec/>)
  }
 }}
 >
 Открыть рекомендации
 </div>
  {
   props.tag.map((el,i)=>{
    return (
    <label key={i}
    id={"x-"+el}
    onClick={(e)=>display(e.target.id.replace("x-",""))} >
     {"#"+el+"  "}
    </label>)
   })
  }
  <div id="rec"
  onClick={()=>{
   likes=JSON.parse(localStorage.getItem("none"));
   localStorage.clear()
   alert("История Очищена")
   ontop()
  }}
  >Очистить историю</div>
 </div>)
}

function Rec(props) {
 //создание локального объекта на основе данных likes
 if (likes.len > 0) {
  var objs = props.arrs.reverse();
  var All = () => <div>
   {
    objs.map((els, i, arr) =>{
     if(i%2!=0){
     var el=objs[objs.length-i]
     }else{
     var el=els
     }
return <div key={i}>
    #{el.titles}<br/>
     <Card obj={el.data} key={i} name={el.titles}/></div>
    })
   }
 </div>
 }
 return <div>
  <button id="back" 
  onClick={()=>{
   Rend(<App/>)
  }}>Назад</button>
  <div id="rec-bg">{likes.len==0&&<h2>Оценивайте фотографии, чтобы сервис создал рекомендации специально для вас</h2>}
  {likes.len>0&&<div><All/></div>}
  </div>
  
  </div>
}

function Rend(el) {
 ReactDOM.render(
  el,
  document.querySelector("#app")
 );
 $(".showInfo").children().toggle()
}

function remake(str) {
 var a, b;
 if (str.includes("<img")) {
  a = str.indexOf("<img")
  var i = a;
  var ch = ""
  while (ch !== ">") {
   i++;
   ch = str[i];
   b = i;
  }
  return str.replace(str.slice(a, b + 1), "")
 }
 return str
}

function ontop() {
 setTimeout(() =>
  $("html,body").animate({
   scrollTop: 0
  }, 600), 700)
}

function getProc() {
 var col = likes.len,
  all = 20;
 var mass = [];
 for (var el in likes.objs) {
  var ram = likes.objs[el];
  ram = ram * 100 / col //процент от 100
  ram = Math.floor(ram * 0.2)
  mass.push({
   [el]: ram })
 }
 return mass;
}

async function getLinksObj(mass = getProc()) {
 var Datas = [];
 var num = 0;
 var num_obj = 0;
 for (var obj of mass) {
  for (var el in obj) {
   var col = obj[el]; //количество картинок//
   num_obj++;
   console.log("Col", col, "el", el);
   var url = `http://api.flickr.com/services/feeds/photos_public.gne?tags=${el}&format=json&nojsoncallback=1`;
   await fetch(proxy + url)
    .then(data => { console.log(data); return data.text() })
    .then(es => {
     var esObj = JSON.parse(es);
     esObj.items=esObj.items.reverse();
     for (var i = 0; i < col; i++) {
      Datas.push({
   ["titles"]: el,
   ["data"]: esObj.items[i]
      })
      console.log(el, "addd")
     }
     return true
    })
    .then(ok => {
     console.log("length obj", mass.length, "num", num_obj)
     if (num_obj == mass.length)
      Rend(<Rec arrs={Datas}/>)
    })
    .catch(console.error)
  }
 }

}

class App extends React.Component {
 constructor() {
  super()
  this.reset = reset;
 }
 state = {
  now: "start",
  type: undefined,
 }
 render() {
  if (this.state.now == "start") {
   return <Names tag={tags} />
  }
  if (this.state.now == "look") {
   return add(this.state.type)
  }
 }
}
Rend(<App/>)



function reset(st, t = null) {
 this.state.now = st;
 this.setState({ now: this.state.now })
 if (t != null) {
  this.state.type = t;
  this.setState({ type: this.state.type })
 }

}
