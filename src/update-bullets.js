;(function(exports) {
  var im = Immutable;

  function updateBullets(input, state, messages) {
    if (!state) {
      return initState();
    }

    return update.pipelineInputDataAndState(input, state, messages, [
      keepNotHit,
      spawn,
      (input, state) => state.map(body => moveWithVelocity(input, body))
    ]);
  };

  function initState() {
    return im.List();
  };

  function keepNotHit(input, state, messages) {
    return state
      .filter(enemy => !collisions.isHit(enemy, im.List(["enemy"]), messages));
  };

  function spawn(input, state, messages) {
    const newBullets = messages
          .filter(message => message.get("type") === "new bullet")
          .map(message => message.get("data")
               .set("size", im.Map({ x: 4, y: 4 }))
               .set("type", "bullet"));

    return state.concat(newBullets);
  };

  exports.updateBullets = updateBullets;
})(this);
