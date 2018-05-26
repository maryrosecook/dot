;(function(exports) {
  var im = Immutable;

  function updateEnemies(input, state, messages) {
    if (!state) {
      return initState();
    }

    return update.pipelineInputDataAndState(input, state, messages, [
      keepNotHit
    ]);
  };

  function initState() {
    return im.List([
      createEnemy({ x: 200, y: 200 })
    ]);
  };

  function keepNotHit(input, state, messages) {
    return state
      .filter(enemy => !collisions.isHit(enemy, messages));
  };

  function createEnemy(center) {
    return im.Map({
      center: im.Map(center),
      size: im.Map({ x: 10, y: 10 })
    });
  };

  exports.updateEnemies = updateEnemies;
})(this);
