;(function(exports) {
  var im = Immutable;

  function update(input, state) {
    return state.update("player", (player) => {
      return updatePlayer(input, player);
    });
  };

  exports.update = update;
})(this);
