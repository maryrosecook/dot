;(function(exports) {
  function start(window) {
    var screen = draw.setupScreen(window);
    var input = new Input(window);
    let state;

    (function loopForever() {
      state = update(input, state);
      draw.draw(state, screen);
      input.update();

      requestAnimationFrame(loopForever);
    })();
  };

  exports.app = {
    start: start
  };
})(this);
