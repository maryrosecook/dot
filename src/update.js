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
      time: Date.now()
    });
  };

  exports.update = {
    update,
    setupState
  };
})(this);
