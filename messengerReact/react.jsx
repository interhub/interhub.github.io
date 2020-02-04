console.log("Hello React");
var x="1us.png",
      y= "2us.png",
      z= "3us.jpg";


class User {
 constructor(id, name, status, url) {
  this.id = id;
  this.name = name;
  this.dialogs = {};
  this.status = status;
  this.url=url;
 }
 setstatus(txt) {
  this.status = txt;
 }
}

class Message {
 constructor(text, date) {
  this.text = text;
  //this.sender = sender;
  //this.geter = geter;
  this.date = date;
 }
}

class Dialog {
 constructor(sender, geter) {
  this.sender = sender;
  this.geter = geter;
  this.mess = [];
 }
}


const setus = function(id, name, status,url) {
 return new User(id, name, status,url);
}

var users = {

 allusers: [
  setus(1, "Stepan T.", "Hello world!",z),
  setus(2, "Dimon K.", "i love hotdogs",x),
  setus(3, "Kate H.", "my name is arnold",y),
  setus(4, "Doni D.", "doni is bony",x),
  setus(5, "Mery J.", "i love animals",y),
  setus(6, "Gery U.", "i not snail",x),
  setus(7, "Fill A.", "i can fly",x),
  ],
 allobj: {

 },
 youid: 1,
 namesObj: {},
 setNamesObj() {
  users.allusers.map((obj, i) => {
   users.namesObj[String(obj.id)] = obj.name;
   users.allobj[String(obj.id)] = obj;
  })
 },
 js(ob) {
  return JSON.stringify(ob)
 },
 getall() {
  console.log(users.js(users.allusers));
  console.log(users.js(users.namesObj))
  console.log(users.js(users.allobj))
 }
}
var startStateMoment = (function() {
 users.setNamesObj();
 users.allobj["1"].dialogs["4"] = new Dialog("1", "4");
 users.allobj["1"].dialogs["6"] = new Dialog("1", "6");
 users.allobj["1"].dialogs["5"] = new Dialog("1", "5");
 users.allobj["1"].dialogs["7"] = new Dialog("1", "7");

 users.getall();
})();

//основной интерфейс
class App extends React.Component {
 constructor(props) {
  super(props)
 }
 state = {
  window: "dialogs",
  dialog: 0
 }

 setdialog = (num) => {
  this.setState({ dialog: num })
  console.log("set dialog:", num);
  this.opendialog();
 }

 opendialog = () => {
  this.setState({ window: "message" })
 }
 closedialog = () => {
  this.setState({ window: "dialogs" })
 }
 send = () => {
  var val = this.refs.Txt.value;
  if (val != "") {
   users.allobj[String(users.youid)]["dialogs"][this.state.dialog].mess.unshift(new Message(val, new Date().toLocaleString()));
   this.opendialog();
   console.log(val);
   this.refs.Txt.value = "";
  }
 }
 redactSt=()=>{
  this.refs.Status.id="statuson";
 }
 normalSt=(event,el=this.refs.Status)=>{
  el.id="";
  users.allobj[String(users.youid)].setstatus(el.value);
 }
 
 status=(id=users.youid)=>{
  return (<div>
  <p>Статус:</p>
  <textarea
  className="status"
  onFocus={this.redactSt}
  onBlur={this.normalSt}
  ref="Status"
  defaultValue={users.allobj[String(id)].status}>
  </textarea>
  </div>)
 }
 
 dialogs = (id = users.youid) => {
  return (<div>
  <div className="title">
   <h3>{"Добрый день "} {users.namesObj[String(id)]}</h3>
   <img width="110"
   className="avatar"
   alt="avatar"
   src={users.allobj[String(id)].url}/>
   </div>
   {this.status()}
    <div>
    <hr/>
   Ваши диалоги:
      <div className="dialogs">
        {
         Object.keys(users.allobj[String(id)]["dialogs"]).map((num,i)=>{
          return(
           <div key={i} className="onedialog"
           onClick = {
            () =>
            this.setdialog(
             num
            )
           }>
           <img width="50"
           src={users.allobj[String(num)].url}
           alt={num} id="dial_img"/>
            <p className="dial li"
            > 
           {users.allobj[num].name}
            </p>
           </div>
           )
         })
        }
      </div>
    </div>
   
   </div>)
 }

 message = (id = users.yuoid, idD = this.state.dialog) => {
  return (<div>
   <h3>{"Диалог с "}{users.allobj[String(idD)]["name"]}</h3>
    <h3 
   onClick={this.closedialog}
   >{"<-Вернуться назад"}
    </h3>
    <div>
     <div className="messages">
     <hr />
     {
      users.allobj[String(users.youid)]["dialogs"][idD].mess.map((obj,i)=>{ return <div key={i} 
      className="onemessage">
       <p className="name">
        {users.namesObj[String(users.youid)]}
       </p>
       <p className="text">
       {obj.text}
       </p>
       <p className="date">
       {obj.date}
       </p>
      </div>})
     }
     <hr id="top"/>
     </div>
     <div className="input">
      <textarea 
      className="textarea"
      ref="Txt">
     
      </textarea>
      <button id="send"
      onClick={this.send}>
      Отправить
      </button>
     </div>
    </div>
 </div>)
 }

 render = () => {
  if (this.state.window === "dialogs") {
   return (<div>{this.dialogs()}</div>)
  }
  if (this.state.window === "message") {
   return (<div>{this.message()}</div>)
  }
 }
}

//создание
const rend = (function() {
 ReactDOM.render(
  <App/>,
  document.querySelector("#app")
 )
})()