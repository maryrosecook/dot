;(function(exports) {
  var im = Immutable;

  function updatePlayer(input, state) {
    function pipelineInputDataAndState(input, state, fns) {
      if (fns.length === 0) {
        return state;
      } else {
        return pipelineInputDataAndState(input,
                                         fns[0](input, state) || state,
                                         fns.slice(1));
      }
    };

    return state.set("player", pipelineInputDataAndState(input, state.get("player"), [
      playerUpdateHeadingIfSpacePressed,
      playerMoveIfSpacePressed,
      playerTurnIfSpaceNotPressed
    ]));
  };

  function playerUpdateHeadingIfSpacePressed(input, state) {
    if (input.isPressed(input.SPACE)) {
      return state.setIn(["movementAngle"],
                         state.getIn(["nextAngle"]));
    }
  };

  function playerMoveIfSpacePressed(input, state) {
    let velocity = Maths.vectorMultiply(
      Maths.angleToVector(state.getIn(["movementAngle"])),
      5);

    return state
      .updateIn(["center"],
                (center) => im.Map(Maths.addVectors(center.toJS(), velocity)))
  };

  function playerTurnIfSpaceNotPressed(input, state) {
    const TURN_RATE = 3;
    return state.updateIn(["nextAngle"],
                          (nextAngle) => nextAngle + TURN_RATE);
  };

  exports.updatePlayer = updatePlayer;
})(this);
