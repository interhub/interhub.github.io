var p1 = "p1";
var p_get = document.getElementById(p1);

var get = "get";
var get_box = document.getElementById(get);

var rad = "rad";
var rad_set = document.getElementById(rad);



function set1(event) {
    setInterval(set(event), 1000);
}
var gX;
var gY;

function set(event) {
    var Xs = event.clientX;
    var Ys = event.clientY;
    //get_box.click &&
    rad_set.style.left = Xs - 120 + "px";
    rad_set.style.top = Ys - 120 + "px";

    p_get.innerHTML = Xs + ":" + Ys;
    gX = Xs;
    gY = Ys;
    get_box.onclick = set2;
}
/*
//var r[20];
//var x = 0;
*/
function set2() {

}
