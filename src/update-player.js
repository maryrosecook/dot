;(function(exports) {
  function updatePlayer(input, state, messages) {
    if (!state) {
      return initState();
    }

    return update.pipelineInputDataAndState(input, state, messages, [
      moveWithVelocity,
      turnIfNotBoosting,
      updateVelocityIfBoosting,
      shootIfTapping
    ]);
  };

  function initState() {
    return im.Map({
      type: "player",
      center: im.Map({ x: 300, y: 300 }),
      size: im.Map({ x: 20, y: 20 }),
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

  function shootIfTapping(input, state) {
    if (input.isPressed(input.LEFT_MOUSE)) {
      const playerCenter = state.get("center").toJS();
      const playerVelocity = state.get("velocity").toJS();
      const angle = state.get("angle");
      const playerSize = state.get("size").toJS();

      const bulletCenter = im.Map(
        Maths.addVectors(
          playerCenter,
          Maths.multiplyVectors(
            playerSize,
            Maths.angleToVector(angle))));

      const bulletVelocity = im.Map(
        Maths.multiplyVectors(
          Maths.angleToVector(angle),
          { x: 7, y: 7 }));

      return state.updateIn(
        ["messages"], messages => {
          return messages.push(
            message(
              "new bullet",
              im.Map({
                center: bulletCenter,
                velocity: bulletVelocity
              })));
        });
    }
  };

  exports.updatePlayer = updatePlayer;
})(this);
