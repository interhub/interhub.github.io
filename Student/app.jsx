import React from 'react';
import ReactDOM from 'react-dom';

const name=document.querySelector("#name");
const bal=document.querySelector("#bal");
const btn=document.querySelector("#btn");
var num=0;
var sr=0;
var students=[];
var info=[
            ['Количество студентов', "Б", "С"],
            ["0",0,0]
  ];
  addgr(info);

btn.addEventListener("click",()=>{
  num++;
    var pers={
     name:name.value,
     bal:bal.value,
     num:num
    };
    students.push(pers);
    addlist(students);
    mathsr(students);
    addgr(pers);
});


function rend(El){
ReactDOM.render(
 El,
  document.getElementById('react-app')
);
}

function addlist(obj){
  const Students=(props)=>
  (<div className="list">
  {obj.map((ob,i)=>{
    return(
      <p key={i}>
      {`${ob.num}. ${ob.name}: бал:${ob.bal}`}
      </p>
      )
  })}
  </div>)
  rend(<Students/>);
}

function mathsr(obj){
  sr=0;
  obj.map((ob,i)=>{
    sr+=Number(ob.bal);
  });
  sr=Math.ceil(sr/(num));
}


function addgr(obj){

info.push([`${String(obj.num)}. ${obj.name}`||"0",obj.bal,sr]);

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable(info);

  var options = {
    title: 'Ссредний бал успеваемости',
    hAxis: { title: 'Количество студентов', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 }
  };

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

}