;(function(exports) {
  var im = Immutable;

  function update(input, state) {
    function pipelineInputDataAndState(input, state, fns) {
      if (fns.length === 0) {
        return state;
      } else {
        return pipelineInputDataAndState(input,
                                         fns[0](input, state),
                                         fns.slice(1));
      }
    };

    return pipelineInputDataAndState(input, state, [
      updateTime,
      updateClickTime,
      updateIsJustClicked,
      updateIsRecentlyClicked
    ]);
  };

  function updateClickTime(input, state) {
    if (input.isPressed(input.LEFT_MOUSE)) {
      return state.set("clickTime", Date.now())
    } else {
      return state;
    }
  };

  function updateIsJustClicked(input, state) {
    if (input.isPressed(input.LEFT_MOUSE)) {
      return state.set("isJustClicked", true);
    } else {
      return state.set("isJustClicked", false);
    }
  };

  function updateIsRecentlyClicked(input, state) {
    return state.set("isRecentlyClicked",
                     state.get("time") - state.get("clickTime") < 100);
  };

  function updateTime(input, state) {
    return state.set("time", Date.now());
  };

  function setupState() {
    return im.Map({
      clickTime: 0,
      time: Date.now(),
      song: [440, ]
    });
  };

  exports.update = {
    update,
    setupState
  };
})(this);
