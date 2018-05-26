;(function(exports) {
  var im = Immutable;

  function updateBullets(input, state, messages) {
    if (!state) {
      return initState();
    }

    return update.pipelineInputDataAndState(input, state, messages, [
      keepNotHit,
      spawn,
      moveWithVelocity
    ]);
  };

  function initState() {
    return im.List();
  };

  function keepNotHit(input, state, messages) {
    return state
      .filter(enemy => !collisions.isHit(enemy, messages));
  };

  function moveWithVelocity(input, state) {
    return state.map(bullet => {
      const velocity = bullet.get("velocity").toJS();
      return bullet.update("center", (center) => {
        return im.Map(
          Maths.addVectors(
            center.toJS(),
            velocity));
      });
    });
  };

  function spawn(input, state, messages) {
    const newBullets = messages
          .filter(message => message.get("type") === "new bullet")
          .map(message => message.get("data").set(
            "size", im.Map({ x: 2, y: 2 })));

    return state.concat(newBullets);
  };

  exports.updateBullets = updateBullets;
})(this);
