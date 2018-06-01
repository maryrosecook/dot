;(function(exports) {
  function updatePlayer(input, state, messages, viewSize) {
    if (!state) {
      return initState(viewSize);
    }

    return update.pipelineInputDataAndState(input, state, messages, [
      moveWithVelocity,
      turnIfNotBoosting,
      updateVelocityIfBoosting
    ]);
  };

  function initState(viewSize) {
    return im.Map({
      type: "player",
      center: im.Map({
        x: viewSize.get("x") / 2,
        y: viewSize.get("y") / 2
      }),
      size: im.Map({ x: 40, y: 40 }),
      velocity: im.Map({ x: 0, y: 0 }),
      angle: 0,
      messages: im.List()
    });
  };

  function updateVelocityIfBoosting(input, state) {
    if (input.isDown(input.LEFT_MOUSE)) {
      const BOOST_SPEED = 0.2
      let velocityChange = Maths.vectorMultiply(
        Maths.angleToVector(state.getIn(["angle"])),
        BOOST_SPEED);

      return state
        .updateIn(["velocity"],
                  (velocity) => im.Map(Maths.addVectors(velocity.toJS(),
                                                        velocityChange)));

    }
  };

  function turnIfNotBoosting(input, state) {
    if (!input.isDown(input.LEFT_MOUSE)) {
      const TURN_RATE = 5;
      return state.updateIn(["angle"],
                            (angle) => angle + TURN_RATE);
    }
  };

  exports.updatePlayer = updatePlayer;
})(this);
