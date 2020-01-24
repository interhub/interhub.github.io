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
 
function Com(props,name=input[0].value,comment=input[1].value){
  num>3?
  num=1:
  num++;
  var obj={
    name:name,
    comment:comment,
    i:num,
    url:`${num}.gif`,
    cl:`$cl{i} cl`
  }
  
  const Name=(props)=>
  (<div>
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
  
  const Avatar=(props)=>
  (<div>
  <img 
  src={props.user.url}
  alt={props.user.name}
  />
  </div>)
  
  const Block=(props)=>(
    <div className={props.user.cl}>
    <Name user={props.user}/>
    <Avatar user={props.user}/>
    <Comment user={props.user}/>
    </div>
    )
   return <Block user={obj}/>
}

///////////////////////
