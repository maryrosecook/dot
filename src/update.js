;(function(exports) {
  var im = Immutable;

  function update(input, state) {
    const messages = state.get("messages");

    return state
      .set("messages", im.List())
      .update("player", player => {
        return wrapIfOffScreen(updatePlayer(input, player, messages), state);
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

  function initState() {
    const size = im.Map({ x: 750, y: 1108 });

    return im.Map({
      size,
      center: im.Map({ x: size.get("x") / 2, y: size.get("y") / 2 }),
      messages: im.List()
    });
  };

  update.pipelineInputDataAndState = pipelineInputDataAndState;
  update.initState = initState;
  exports.update = update;
})(this);
