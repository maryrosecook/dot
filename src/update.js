;(function(exports) {
  var im = Immutable;

  function update(input, state) {
    const messages = state.get("messages");

    return state
      .set("messages", im.List())
      .update("player", player => {
        return updatePlayer(input, player, messages);
      }).update("bullets", bullets => {
        return updateBullets(input, bullets, messages);
      }).update("enemies", enemies => {
        return updateEnemies(input, enemies, messages);
      }).update(state => {
        return harvestMessages(state, "player");
      }).update(state => {
        return state.update("messages", messages => {
          return messages.concat(collisions(bodies(state)));
        });
      });
  };

  function bodies(state) {
    return im.List()
      .concat([state.get("player")])
      .concat(state.get("bullets"))
      .concat(state.get("enemies"));
  };

  function pipelineInputDataAndState(input, state, messages, fns) {
    if (fns.length === 0) {
      return state;
    } else {
      return pipelineInputDataAndState(
        input,
        fns[0](input, state, messages) || state,
        messages,
        fns.slice(1));
    }
  };

  function harvestMessages(state, part) {
    return state.update("messages", messages => {
      return messages
        .concat(state.getIn([part, "messages"]));
    }).setIn([part, "messages"], im.List());
  };

  update.pipelineInputDataAndState = pipelineInputDataAndState;
  exports.update = update;
})(this);
