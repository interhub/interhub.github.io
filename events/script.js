var photo = "photo";
var src_one = "1.jpg";
var src_two = "2.jpg";
var set_photo = document.getElementsByClassName(photo);

function set_one() {
    set_photo[0].src = src_one;
}

function set_two() {
    set_photo[0].src = src_two;
}

window.addEventListener("ontouchstart", set_one);
window.addEventListener("ontouchend", set_two);
