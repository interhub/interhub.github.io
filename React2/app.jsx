import React from 'react';
import ReactDOM from 'react-dom';


const Timer = (props) =>
  (<div className="date">
{props.date.toLocaleString()}
</div>)

const Start = () => {

  ReactDOM.render(
    <Timer date={new Date()}/>,
    document.getElementById('time')
  );
}

setInterval(Start, 1000);


const btn=document.querySelector("#btn");
const input=document.querySelectorAll("input");
const box=document.querySelector("#react");
var num=0;

    function rend(El,cont){
  ReactDOM.render(
    El,
    cont
  );
 }
 
 btn.addEventListener("click",()=>{
   let comment=document.createElement("div");
   box.appendChild(comment);
   rend(Com(),comment)
 })
 
 function clearValue(a,b){
   a.value="";
   b.value="";
 }
 
 const file_btn=document.querySelector("#file");
 const Av=document.querySelector("#av");
 Av.onclick=()=>file_btn.click();
 const form=document.querySelector("#form");
 form.onsubmit=(event)=>{
   event.preventDefault();
 }
 
 file_btn.onchange=()=>adds(file_btn);
 var ram;
 function dell_ram(){
   ram=null;
   file_btn.value="";
   Av.innerText="Добавить Аватар";
 }
 
 
 function adds(inp) {
   var file = inp.files[0];
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.addEventListener("load",
   (event) => {
     ram = event.target.result;
     Av.innerText="Фото загружено";
   })
 }
 
function Com(props,name=input[1].value,comment=input[2].value,ram_img=ram){
  num>3?
  num=1:
  num++;
  var obj={
    name:name,
    comment:comment,
    i:num,
    url:ram_img,
    cl:`$cl{i} cl`
  }
  const Name=(props)=>
  (<div className="name">
  {props.user.name}
  </div>)
  
  const Comment=(props)=>
  (<div>
  <div className="comment">
  {props.user.comment}
  </div>
  <div>
    <Timer date={new Date()}/>
  </div>
  </div>)
  
  const Avatar=(props)=>{
    if(props.user.url!=undefined)
  return(<div>
  <img 
  src={props.user.url}
  alt={props.user.name}
  width="120"
  />
  </div>);
  else return(
    <svg width="150" height="150">
    <polygon points="70,5 90,41 136,48 103,80 111,126 70,105 29,126 36,80 5,48 48,41" 
    fill="turquoise" stroke="lightseagreen"
    stroke-width="5" />
    </svg>
    )
  
  }
  
  const Block=(props)=>(
    <div className={props.user.cl}>
    <Name user={props.user}/>
    <Avatar user={props.user}/>
    <Comment user={props.user}/>
    </div>
    )
    
    if(name!=""&&comment!=""){
      dell_ram();
      clearValue(input[1], input[2])
   return <Block user={obj}/>
    }
   
}

///////////////////////
