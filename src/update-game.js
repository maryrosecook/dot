;(function(exports) {
  function updateGame(input, state, messages, tokens) {
    if (!state) {
      return initState();
    }

    return update.pipelineInputDataAndState(input, state, messages, [

    ]);
  };

  function initState() {
    return im.Map({
      messages: im.List()
    });
  };

  exports.updateGame = updateGame;
})(this);
