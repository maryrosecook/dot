;(function(exports) {
  function update(input, state) {
    let nextMessages = im.List();
    function sendMessage(message) {
      nextMessages = nextMessages.push(message);
    };

    const messages = state.get("messages");
    return state
      .set("messages", im.List())
      .update(state => updateGame(input, state, messages))
      .update("player", player => {
        return updatePlayer(input,
                            player,
                            messages,
                            state.get("center"),
                            state.get("size"),
                            sendMessage);
      }).update("tokens", tokens => {
        return updateTokens(input,
                            tokens,
                            messages,
                            state.get("size"),
                            state.get("remainingTokens"),
                            sendMessage)
      })
      .update((state) => harvestMessages(state, nextMessages, sendMessage))
  };

  function bodies(state) {
    return im.List()
      .concat([state.get("player")])
      .concat(state.getIn(["tokens", "tokens"]));
  };

  function harvestMessages(state, nextMessages) {
    const messages = collisions(bodies(state))
          .concat(nextMessages);

    return state.set("messages", messages);
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
