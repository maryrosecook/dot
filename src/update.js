;(function(exports) {
  var im = Immutable;

  function update(input, state) {
    if (!state) {
      state = setupState();
    }

    return state.update("player", (player) => {
      return updatePlayer(input, player);
    });
  };

  function setupState() {
    return im.Map({});
  };

  exports.update = update;
})(this);
