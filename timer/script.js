var display = "display";
var display_set = window.document.getElementById(display);

function repeat() {
    setInterval(set, 100);
}
repeat();

function set() {
    ///переменные времни
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var mil = date.getMilliseconds();

    display_set.innerHTML = "Сейчас: <br/>" +
        "Дата: " + day + "." + month + "<br/>" +
        "Время: " + hour + "." + min + "." + sec;

}
