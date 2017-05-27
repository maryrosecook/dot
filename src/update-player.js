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

    return state.update("player", (player) => pipelineInputDataAndState(input, player, [
      playerUpdateHeadingIfSpacePressed,
      playerMoveIfSpacePressed,
      playerTurnIfSpaceNotPressed
    ]));
  };

  function initState() {
    return im.Map({
      center: im.Map({ x: 300, y: 300 }),
      width: 5,
      height: 5,
      movementAngle: 0,
      nextAngle: 0
    });
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
    const TURN_RATE = 5;
    return state.updateIn(["nextAngle"],
                          (nextAngle) => nextAngle + TURN_RATE);
  };

  exports.updatePlayer = updatePlayer;
})(this);
