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
      (_, dots) => dots.map(rotateDot),
      (_, dots) => dots.map(moveDotInArc),
      (_, dots) => {
        dots.map((dot) => wrapDot(dot, data))
      }
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

  function rotateDot(dot) {
    return dot.update("angle", (angle) => angle + 0.05);
  };

  function wrapDot(dot, data) {
    let xScreen = data.getIn(["size", "x"]);
    let yScreen = data.getIn(["size", "y"]);
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
  };

  function moveDotInArc(dot) {
    return dot.update("center", (center) => {
      let angle = dot.get("angle");
      let rotating = {
        x: Math.sin(angle),
        y: Math.cos(angle)
      };
      let wideRotating = Maths.multiplyVectors(
        rotating,
        dot.get("velocityWideRotate").toJS());
      let translating = Maths.addVectors(
        wideRotating,
        dot.get("velocityTranslate").toJS());

      return im.Map(Maths.addVectors(center.toJS(), translating));
    });
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
