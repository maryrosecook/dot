;(function(exports) {
  var im = Immutable;

  const SIZE = im.Map({ x: 20, y: 20 });

  function updateEnemies(input, state, messages, viewSize) {
    if (!state) {
      return initState();
    }

    return update.pipelineInputDataAndState(input, state, messages, [
      keepNotHit,
      (_, state) => state.map(body => moveWithVelocity(_, body)),
      (_, state) => state
        .update(state => spawnEnemyIfTooFew(state, viewSize))
    ]);
  };

  function initState() {
    return im.List();
  };

  function keepNotHit(input, state, messages) {
    return state
      .filter(enemy => !collisions.isHit(enemy, im.List(["bullet"]), messages));
  };

  function createEnemy(center) {
    return im.Map({
      type: "enemy",
      center: im.Map(center),
      size: SIZE,
      velocity: im.Map({ x: Maths.spread(7), y: Maths.spread(7) })
    });
  };

  function spawnEnemyIfTooFew(enemies, viewSize) {
    if (enemies.count() >= 10) {
      return;
    }

    const center = Maths.surroundingSpawnPoint({
      x: viewSize.get("x") / 2,
      y: viewSize.get("y") / 2
    }, Math.max(viewSize.get("x"), viewSize.get("y")));
    return enemies.push(createEnemy(center));
  };

  function randomSpawnPosition(viewSize, bodySize) {
    const positions = im.List([
      im.Map({ x: -bodySize.get("x"), y: viewSize.get("y") / 2 })
    ]);

    return positions.get(Math.floor(Math.random() * positions.count()));
  };

  updateEnemies.SIZE = SIZE;
  exports.updateEnemies = updateEnemies;
})(this);
