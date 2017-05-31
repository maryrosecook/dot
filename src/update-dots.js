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
      (_, dots) => dots.map(moveWithVelocity),
      wrapDots
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

  function wrapDots(input, dots, data) {
    let xScreen = data.getIn(["size", "x"]);
    let yScreen = data.getIn(["size", "y"]);
    return dots.map((dot) => {
      let radius = dot.getIn(["size", "x"]) / 2;
      let left = dot.getIn(["center", "x"]) - radius;
      let right = dot.getIn(["center", "x"]) + radius;
      let bottom = dot.getIn(["center", "y"]) + radius;
      let top = dot.getIn(["center", "y"]) - radius;

      if (right < 0) {
        return dot.setIn(["center", "x"], xScreen + radius);
      }

      if (left > xScreen) {
        return dot.setIn(["center", "x"], -radius);
      }

      if (bottom < 0) {
        return dot.setIn(["center", "y"], yScreen + radius);
      }

      if (top > yScreen) {
        return dot.setIn(["center", "y"], -radius);
      }

      return dot;
    });
  };

  function moveWithVelocity(dot) {
    return dot.update("center", (center) => {
      return im.Map(Maths.addVectors(center.toJS(), dot.get("velocity").toJS()));
    });
  };

  function createDot(center) {
    return im.Map({
      center: im.Map(center),
      size: im.Map({ x: 50, y: 50 }),
      velocity: im.Map({ x: 1, y: 2 })
    });
  };

  function randomRange(min, max) {
    let range = max - min;
    return min + Math.random() * range;
  };

  exports.updateDots = updateDots;
})(this);
