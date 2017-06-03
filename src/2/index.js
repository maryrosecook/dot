;(function(exports) {
  var im = Immutable;

  window.addEventListener("load", function() {
    start(window);
  });

  function start(window) {
    var screen = drawer.setup(window);
    var input = new Input(window);
    let state = setupState(screen);

    (function loopForever() {
      state = update(input, state, screen);
      input.update();

      requestAnimationFrame(loopForever);
    })();
  };

  function setupState(screen) {
    return im.Map({
      size: im.Map({ x: screen.canvas.width, y: screen.canvas.height })
    });
  };
})(this);
