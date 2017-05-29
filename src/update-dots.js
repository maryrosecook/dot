;(function(exports) {
  var im = Immutable;

  function updateDots(input, state) {
    function pipelineInputDataAndState(input, state, fns) {
      if (state === undefined) {
        return initState();
      } else if (fns.length === 0) {
        return state;
      } else {
        return pipelineInputDataAndState(input,
                                         fns[0](input, state) || state,
                                         fns.slice(1));
      }
    };

    return pipelineInputDataAndState(input, state, [
      (_, dots) => dots.map(moveWithVelocity)
    ]);
  };

  function initState() {
    return im.List([
      createDot({ x: 500, y: 500 }),
      createDot({ x: 100, y: 100 }),
      createDot({ x: 500, y: 100 }),
      createDot({ x: 200, y: 600 })
    ]);
  };

  function moveWithVelocity(dot) {
    return dot.update("center", (center) => {
      return im.Map(Maths.addVectors(center.toJS(), dot.get("velocity").toJS()));
    });
  };

  function createDot(center) {
    return im.Map({
      center: im.Map(center),
      size: im.Map({ x: 5, y: 5 }),
      velocity: im.Map({ x: randomRange(-1, 1), y: randomRange(-1, 1) })
    });
  };

  function randomRange(min, max) {
    let range = max - min;
    return min + Math.floor(Math.random() * range);
  };

  exports.updateDots = updateDots;
})(this);
