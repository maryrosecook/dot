;(function(exports) {
  var im = Immutable;

  function start(window) {
    var screen = draw.setupScreen(window);
    var input = new Input(window);
    let state = setupState(screen);

    (function loopForever() {
      state = update(input, state);
      draw.draw(state, screen);
      input.update();

      requestAnimationFrame(loopForever);
    })();
  };

  function setupState(screen) {
    return im.Map({
      size: im.Map({ x: screen.canvas.width, y: screen.canvas.height })
    });
  };

  exports.app = {
    start: start
  };
})(this);
