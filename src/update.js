;(function(exports) {
  var im = Immutable;

  function update(input, state) {
    function pipelineInputDataAndState(input, state, fns) {
      if (fns.length === 0) {
        return state;
      } else {
        return pipelineInputDataAndState(input,
                                         fns[0](input, state) || state,
                                         fns.slice(1));
      }
    };

    return pipelineInputDataAndState(input, state, [
      updateTime,
      updatePlayer
    ]);
  };

  function updateTime(input, state) {
    return state.set("time", Date.now());
  };

  function setupState() {
    return im.Map({
      clickTime: 0,
      time: Date.now(),
      player: im.Map({
        center: im.Map({ x: 300, y: 300 }),
        width: 5,
        height: 5,
        movementAngle: 0,
        nextAngle: 0
      })
    });
  };

  exports.update = {
    update,
    setupState
  };
})(this);
