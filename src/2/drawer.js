;(function(exports) {
  function clear(screen) {
    screen.clearRect(0,
                     0,
                     screen.canvas.width,
                     screen.canvas.height);
  };

  function circle(screen, center, radius) {
    screen.beginPath();
    screen.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    screen.closePath();
    screen.fillStyle = "black";
    screen.fill();
  };

  function line(screen, from, to, width, color) {
    screen.beginPath();
    screen.moveTo(from.x, from.y);
    screen.lineTo(to.x, to.y);
    screen.closePath();

    screen.lineWidth = width;
    screen.strokeStyle = color;
    screen.stroke();
  };

  function setup(window) {
    var screen = window
        .document
        .getElementById("screen")
        .getContext("2d");
    screen.canvas.width = window.innerWidth;
    screen.canvas.height = window.innerHeight;
    return screen;
  };

  exports.drawer = {
    circle,
    line,
    setup,
    clear
  };
})(this);
