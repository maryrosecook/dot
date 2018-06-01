;(function(exports) {
  function updateGame(input, state, messages) {
    return update.pipelineInputDataAndState(input, state, messages, [
      updateRemainingTokens,
      monitorGameOver
    ]);
  };

  function monitorGameOver(_, state) {
    if (state.get("remainingTokens") >= 0) {
      return state;
    }

    const thisGameTime = Date.now() - state.get("startTime");
    let bestTime = state.get("bestTime");

    if (bestTime === undefined ||
        thisGameTime < bestTime) {
      bestTime = thisGameTime;
    }

    return initState()
      .set("bestTime", bestTime);
  };

  function updateRemainingTokens(_, state, messages) {
    const eatenTokens = messages
          .filter(message.isType("token gone"))
          .count();
    return state.update(
      "remainingTokens", remainingTokens => remainingTokens - eatenTokens);
  };

  function initState() {
    const size = im.Map({ x: 750, y: 1108 });

    return im.Map({
      size,
      center: im.Map({ x: size.get("x") / 2, y: size.get("y") / 2 }),
      startTime: Date.now(),
      bestTime: undefined,
      remainingTokens: 9,
      messages: im.List()
    });
  };

  updateGame.initState = initState;
  exports.updateGame = updateGame;
})(this);
