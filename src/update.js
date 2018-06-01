;(function(exports) {
  function update(input, state) {
    const messages = state.get("messages");

    return state
      .set("messages", im.List())
      .update(state => updateGame(state, messages))
      .update("player", player => {
        return updatePlayer(input, player, messages, state.get("size"))
          .update(player => wrapIfOffScreen(player, state));
      }).update("tokens", tokens => {
        return updateTokens(input,
                            tokens,
                            messages,
                            state.get("size"),
                            state.get("remainingTokens"))
          .update("tokens", tokens =>
                  tokens.map(body => wrapIfOffScreen(body, state)));
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

  function updateGame(state, messages) {
    return state
      .update(state => updateRemainingTokens(state, messages))
      .update(monitorGameOver);
  };

  function updateRemainingTokens(state, messages) {
    const eatenTokens = messages
          .filter(message.isType("token gone"))
          .count();
    return state.update(
      "remainingTokens", remainingTokens => remainingTokens - eatenTokens);
  };

  function monitorGameOver(state) {
    if (state.get("remainingTokens") >= 0) {
      return state;
    }

    const thisGameTime = Date.now() - state.get("startTime");
    let bestTime = state.get("bestTime");

    if (bestTime === undefined ||
        thisGameTime < bestTime) {
      bestTime = thisGameTime;
      console.log(bestTime)
    }

    return initState()
      .set("bestTime", bestTime);
  };

  function wrapIfOffScreen(body, state) {
    const bodyRect = rect(body);
    const viewRect = rect(state);

    if ((bodyRect.get("r") < viewRect.get("l") &&
         body.getIn(["velocity", "x"]) < 0) ||
        (bodyRect.get("l") > viewRect.get("r") &&
         body.getIn(["velocity", "x"]) > 0)) {
      return body.setIn(
        ["center", "x"],
        state.getIn(["size", "x"]) - body.getIn(["center", "x"]));
    }

    if ((bodyRect.get("b") < viewRect.get("t") &&
         body.getIn(["velocity", "y"]) < 0) ||
        (bodyRect.get("t") > viewRect.get("b") &&
         body.getIn(["velocity", "y"]) > 0)) {
      return body.setIn(
        ["center", "y"],
        state.getIn(["size", "y"]) - body.getIn(["center", "y"]));
    }

    return body;
  };

  function rect(body) {
    const center = body.get("center").toJS();
    const size = body.get("size").toJS();

    return im.Map({
      t: center.y - size.y / 2,
      r: center.x + size.x / 2,
      b: center.y + size.y / 2,
      l: center.x - size.x / 2
    });
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

  function initState() {
    const size = im.Map({ x: 750, y: 1108 });

    return im.Map({
      size,
      center: im.Map({ x: size.get("x") / 2, y: size.get("y") / 2 }),
      startTime: Date.now(),
      bestTime: undefined,
      remainingTokens: 1,
      messages: im.List()
    });
  };

  update.pipelineInputDataAndState = pipelineInputDataAndState;
  update.initState = initState;
  exports.update = update;
})(this);
