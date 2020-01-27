import React from 'react';
import ReactDOM from 'react-dom';


const info=["Мерседес","Ауди","Вольво","Пежо","Ситроен","БМВ"];

const display=(event)=>{
  click(event.clientX,event.clientY,event.target.id);
return console.log(event.target.id);
}

const Table=(props)=>
(<div>{
info.map((el,i)=>
(<p key={i} id={el} onClick={display}>{el}</p>))
}
</div>)

ReactDOM.render(
  <Table name={"Nameclass"}/>,
  document.getElementById('react-app')
);

const aler=document.querySelector("#alert");

const click=(x,y,val)=>{
  aler.style.display="block";
  setTimeout(()=>
  aler.style.display="none",1000);
  aler.style.left=`${x-50}px`;
  aler.style.top=`${y-50}px`;
  aler.innerText=val;
}
