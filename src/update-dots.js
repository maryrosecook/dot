;(function(exports) {
  var im = Immutable;

  function updateDots(input, state, data) {
    function pipelineInputDataAndState(input, state, data, fns) {
      if (state === undefined) {
        return initState();
      } else if (fns.length === 0) {
        return state;
      } else {
        return pipelineInputDataAndState(input,
                                         fns[0](input, state, data) || state,
                                         data,
                                         fns.slice(1));
      }
    };

    return pipelineInputDataAndState(input, state, data, [
      updateIndividualDots,
      spawnDots
    ]);
  };

  function initState() {
    return im.Map({
      lastDotCreated: 0,
      dots: im.List([

      ])
    });
  };

  function updateIndividualDots(input, state, data) {
    return state.update("dots", (dots) => {
      return dots.map((dot) => updateDot(input, dot, data));
    });
  };

  function spawnDots(input, state, data) {
    if (isTimeToCreateDot(state.get("lastDotCreated"))) {
      return state.update("dots", (dots) => {
        return dots.push(createDot({ x: 0, y: 0 }));
      }).set("lastDotCreated", Date.now());
    }
  };

  function isTimeToCreateDot(lastDotCreated) {
    const TIME_BETWEEN_DOT_CREATIONS = 5000;
    return lastDotCreated + TIME_BETWEEN_DOT_CREATIONS < Date.now();
  };

  function createDot(center) {
    const ROTATION = 3;
    const MAX_TRANSLATION = 3;
    let translator = randomRange(-MAX_TRANSLATION, MAX_TRANSLATION);
    return im.Map({
      center: im.Map(center),
      size: im.Map({ x: 5, y: 5 }),
      angle: 0,
      velocityWideRotate: im.Map({
        x: ROTATION,
        y: ROTATION
      }),
      velocityTranslate: im.Map({
        x: translator,
        y: translator
      })
    });
  };

  function randomRange(min, max) {
    let range = max - min;
    return min + Math.random() * range;
  };

  exports.updateDots = updateDots;
})(this);
