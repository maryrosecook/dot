var im = Immutable;

;(function(exports) {
  window.addEventListener("load", function() {
    start(window);
  });

  function start(window) {
    let state = updateGame.initState();
    let screen = getScreen(window);
    draw.setupScreen(screen, state.get("size"), draw.windowSize(window));
    var input = new Input(window);


    (function loopForever() {
      state = update(input, state);
      draw.draw(state, screen, draw.windowSize(window));
      input.update();

      requestAnimationFrame(loopForever);
    })();
  };

  function getScreen(window) {
    return window
      .document
      .getElementById("screen")
      .getContext("2d");
  };
})(this);
