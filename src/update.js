;(function(exports) {
  var im = Immutable;

  function update(input, state) {
    return state.update("player", (player) => {
      return updatePlayer(input, player);
    }).update("dotGroup", (dots) => {
      return updateDots(input,
                        dots,
                        im.Map({ size: state.get("size") }));
    });
  };

  exports.update = update;
})(this);
