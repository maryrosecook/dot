;(function(exports) {
  function update(input, state) {
    const messages = state.get("messages");

    return state
      .set("messages", im.List())
      .update(state => updateGame(input, state, messages))
      .update("player", player => {
        return updatePlayer(input,
                            player,
                            messages,
                            state.get("center"),
                            state.get("size"));
      }).update("tokens", tokens => {
        return updateTokens(input,
                            tokens,
                            messages,
                            state.get("size"),
                            state.get("remainingTokens"))
      })
      .update(harvestMessages)
      .update(state => {
        return state.update("messages", messages => {
          return messages.concat(collisions(bodies(state)));
        });
      });
  };

  function bodies(state) {
    return im.List()
      .concat([state.get("player")])
      .concat(state.getIn(["tokens", "tokens"]));
  };

  function harvestMessages(state) {
    const messages = state.getIn(["player", "messages"])
          .concat(state.getIn(["tokens", "messages"]));

    return state.set("messages", messages)
      .setIn(["player", "messages"], im.List())
      .setIn(["tokens", "messages"], im.List());
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

  update.pipelineInputDataAndState = pipelineInputDataAndState;
  exports.update = update;
})(this);
