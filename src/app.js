;(function(exports) {
  function start(window) {
    var state = update.setupState();
    var screen = draw.setupScreen(window);
    var input = new Input(window);

    (function loopForever() {
      state = update.update(input, state);
      draw.draw(state, screen);
      input.update();

      requestAnimationFrame(loopForever);
    })();
  };

  exports.app = {
    start: start
  };
})(this);
