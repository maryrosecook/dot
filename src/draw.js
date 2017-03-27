;(function(exports) {
  function draw(state, screen) {
    screen.clearRect(0,
                     0,
                     screen.canvas.width,
                     screen.canvas.height);
    if (state.get("isRecentlyClicked")) {
      flashScreen(screen);
    }
  };

  function flashScreen(screen) {
    screen.fillRect(0, 0, screen.canvas.width, screen.canvas.height)
  };

  function setupScreen(window) {
    var screen = window
        .document
        .getElementById("screen")
        .getContext("2d");
    screen.canvas.width = window.innerWidth;
    screen.canvas.height = window.innerHeight;
    return screen;
  };

  exports.draw = {
    draw,
    setupScreen
  };
})(this);
