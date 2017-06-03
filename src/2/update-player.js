;(function(exports) {
  var im = Immutable;

  function updatePlayer(input, state, data, screen) {
    function pipelineInputDataAndState(input, state, fns) {
      if (state === undefined) {
        return initState();
      } else if (fns.length === 0) {
        return state;
      } else {
        return pipelineInputDataAndState(input,
                                         fns[0](input, state) || state,
                                         fns.slice(1));
      }
    };

    let newState = pipelineInputDataAndState(input, state, [
      recordPresses
    ]);

    draw(newState, data, screen);
    return newState
  };

  function recordPresses(input, state) {
    if (input.isDown(input.LEFT_MOUSE)) {
      return state.update("ys", (presses) => {
        return presses.push(timeSinceStart(state.get("startTime")));
      });
    }
  };

  function draw(state, data, screen) {
    withScreenCenteredOnCurrentTime(state, data, screen, () => {
      state.get("ys").forEach((press) => {
        drawer.circle(screen, { x: 200, y: scale(press) }, 1);
      });
    });
  };

  function withScreenCenteredOnCurrentTime(state, data, screen, fn) {
    screen.save();
    let yScreenMiddle = data.get("y") / 2;
    screen.translate(0, yScreenMiddle - scale(timeSinceStart(state.get("startTime"))));
    fn();
    screen.restore();
  };

  function scale(n) {
    return n / 10;
  };

  function timeSinceStart(startTime) {
    return Date.now() - startTime;
  };

  function initState() {
    return im.Map({
      startTime: Date.now(),
      ys: im.List()
    });
  };

  exports.updatePlayer = updatePlayer;
})(this);
