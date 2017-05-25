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
      playerUpdateHeadingIfSpacePressed,
      playerMoveIfSpacePressed,
      playerTurnIfSpaceNotPressed
    ]);
  };

  function playerUpdateHeadingIfSpacePressed(input, state) {
    if (input.isPressed(input.SPACE)) {
      return state.setIn(["player", "movementAngle"],
                         state.getIn(["player", "nextAngle"]));
    }
  };

  function playerMoveIfSpacePressed(input, state) {
    let velocity = Maths.vectorMultiply(
      Maths.angleToVector(state.getIn(["player", "movementAngle"])),
      5);

    return state
      .updateIn(["player", "position", "x"], (x) => x + velocity.x)
      .updateIn(["player", "position", "y"], (y) => y + velocity.y)
  };

  function playerTurnIfSpaceNotPressed(input, state) {
    const TURN_RATE = 3;
    return state.updateIn(["player", "nextAngle"],
                          (nextAngle) => nextAngle + TURN_RATE);
  };

  function updateTime(input, state) {
    return state.set("time", Date.now());
  };

  function setupState() {
    return im.Map({
      clickTime: 0,
      time: Date.now(),
      player: im.Map({
        position: im.Map({ x: 300, y: 300 }),
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
