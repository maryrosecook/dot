;(function(exports) {
  var im = Immutable;

  window.addEventListener("load", function() {
    start(window);
  });

  function start(window) {
    let state = setupState();
    let screen = getScreen(window);
    draw.setupScreen(screen, state.get("size"), draw.windowSize(window));
    var input = new Input(window);


    (function loopForever() {
      state = update(input, state);
      draw.draw(state, screen);
      input.update();

      requestAnimationFrame(loopForever);
    })();
  };

  function setupState() {
    return im.Map({
      size: im.Map({ x: 750, y: 1108 }),
      messages: im.List()
    });
  };

  function getScreen(window) {
    return window
      .document
      .getElementById("screen")
      .getContext("2d");
  };
})(this);
