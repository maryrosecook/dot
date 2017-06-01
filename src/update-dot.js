;(function(exports) {
  var im = Immutable;

  function updateDot(input, state, data) {
    function pipelineInputDataAndState(input, state, data, fns) {
      if (fns.length === 0) {
        return state;
      } else {
        return pipelineInputDataAndState(input,
                                         fns[0](input, state, data) || state,
                                         data,
                                         fns.slice(1));
      }
    };

    return pipelineInputDataAndState(input, state, data, [
      rotateDot,
      moveDotInArc,
      wrapDot
    ]);
  };

  function rotateDot(input, dot, data) {
    return dot.update("angle", (angle) => angle + 0.05);
  };

  function wrapDot(input, dot, data) {
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

  function moveDotInArc(input, dot, data) {
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


  exports.updateDot = updateDot;
})(this);
