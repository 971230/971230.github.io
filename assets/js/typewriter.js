function text(str) {
  var arr = [];
  var text = document.getElementsByClassName("typewriter")[0];
  for (var i = 0; i < str.length; i++) {
    arr[i] = str[i];
  }
  var p = document.createElement("p");
  text.appendChild(p);
  var index = 0;
  setInterval(function () {
    if (index < arr.length) {
      var text = document.createTextNode(arr[index]);
      p.appendChild(text);
    }
    index++;
  }, 200);
}

window.onload = function () {
  text("Hello, World!");
};
