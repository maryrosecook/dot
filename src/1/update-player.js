;(function(exports) {
  var im = Immutable;

  function updatePlayer(input, state) {
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

    return pipelineInputDataAndState(input, state, [
      moveWithVelocity,
      turnIfNotBoosting,
      updateVelocityIfBoosting
    ]);
  };

  function initState() {
    return im.Map({
      center: im.Map({ x: 300, y: 300 }),
      size: im.Map({ x: 5, y: 5 }),
      velocity: im.Map({ x: 0, y: 0 }),
      angle: 0
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

  function moveWithVelocity(input, state) {
    return state.update("center", (center) => {
      return im.Map(Maths.addVectors(center.toJS(), state.get("velocity").toJS()));
    });
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
