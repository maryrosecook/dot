;(function(exports) {
  var im = Immutable;

  function update(input, state, screen) {
    drawer.clear(screen);

    let newState = state.update("player", (player) => {
      return updatePlayer(input,
                          player,
                          state.get("size"),
                          screen);
    });

    return newState;
  };

  exports.update = update;
})(this);
