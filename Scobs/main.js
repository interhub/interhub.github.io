console.log('Hello World!');

var Read = {
  Break: function(txt) {
    return txt.split("");
  },
  nChar: function(txt, char) {
    var n = 0;
    txt.map((ch) => {
      ch === char ?
        n++ :
        n += 0;
    });
    return n;
  },
  scan: function(txt) {
    if (this.nChar(this.Break(txt), "{") ===
      this.nChar(this.Break(txt), "}")) {
      return true;
    }
    else {
      return false;
    }
  },
  display:function (txt){
    if (this.scan(txt)) {
      this.inner("Скобки не нарушены")
    }
    else {
      this.inner("Нарушен синтаксис скобок");
    }
  },
  inner:function(txt){
    var p=document.querySelector("p");
    p.innerText=txt;
  }
}

//const input=document.querySelector("#input");
function Files(input){
  var file=input.files[0];
  var reader=new FileReader();
  reader.readAsText(file);
  reader.onload=function (){
  Read.display(reader.result);
  }
}


Read.display("{g}");





