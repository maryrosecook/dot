;(function(exports) {
  const SIZE = im.Map({ x: 40, y: 40 });

  function updateTokens(input, state, messages, viewSize, remainingTokens) {
    if (!state) {
      return initState(viewSize);
    }

    return update.pipelineInputDataAndState(input, state, messages, [
      keepNotHit,
      (_, state) => state
        .update("tokens", tokens =>
                tokens.map(body => moveWithVelocity(_, body))),
      (_, state) => spawnIfNoTokens(state, viewSize, remainingTokens)
    ]);
  };

  function initState(viewSize) {
    return im.Map({
      tokens: im.List(),
      messages: im.List()
    });
  };

  function randomSpawnPosition(viewSize, bodySize) {
    return im.Map({
      x: Math.random() * (viewSize.get("x") - bodySize.get("x") / 2),
      y: Math.random() * (viewSize.get("y") - bodySize.get("y") / 2)
    });
  };

  function keepNotHit(input, state, messages) {
    return state.update("tokens", (tokens) => {
      return tokens
        .filter(token => !collisions.isHit(token, im.List(["player"]), messages));
    });
  };

  function spawnIfNoTokens(state, viewSize, remainingTokens) {
    if (state.get("tokens").count() > 0) {
      return;
    }

    return state
      .update(
        "tokens", tokens => tokens.push(
          createToken(randomSpawnPosition(viewSize, SIZE), remainingTokens)))
      .update(
        "messages",
        messages => messages.push(message("token gone")));
  };

  function createToken(center, id) {
    return im.Map({
      type: "token",
      center: im.Map(center),
      size: SIZE,
      id,
      velocity: im.Map({ x: 0, y: 0 })
    });
  };

  updateTokens.SIZE = SIZE;
  updateTokens.initState = initState;
  exports.updateTokens = updateTokens;
})(this);
