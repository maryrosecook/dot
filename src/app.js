;(function(exports) {
  function start(window) {
    var state = update.setupState();
    var synthesiser = createSynthesiser();
    var screen = draw.setupScreen(window);
    var input = new Input(window);

    var tick = 0;
    (function loopForever() {
      if (tick++ % 1 === 0) {
        state = update.update(input, state);
        draw.draw(state, screen);
        sound.update(state, synthesiser);
        input.update();
      }

      requestAnimationFrame(loopForever);
    })();
  };

  // fill in missing beats
  // play harmony
  // play melody

  exports.app = {
    start: start
  };
})(this);
