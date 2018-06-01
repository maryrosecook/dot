function wrapIfOffScreen(body, viewCenter, viewSize) {
  const bodyRect = rect(body.get("center"), body.get("size"));
  const viewRect = rect(viewCenter, viewSize);

  if ((bodyRect.get("r") < viewRect.get("l") &&
       body.getIn(["velocity", "x"]) < 0) ||
      (bodyRect.get("l") > viewRect.get("r") &&
       body.getIn(["velocity", "x"]) > 0)) {
    return body.setIn(
      ["center", "x"],
      viewSize.get("x") - body.getIn(["center", "x"]));
  }

  if ((bodyRect.get("b") < viewRect.get("t") &&
       body.getIn(["velocity", "y"]) < 0) ||
      (bodyRect.get("t") > viewRect.get("b") &&
       body.getIn(["velocity", "y"]) > 0)) {
    return body.setIn(
      ["center", "y"],
      viewSize.get("y") - body.getIn(["center", "y"]));
  }

  return body;
};

function rect(centerIm, sizeIm) {
  const center = centerIm.toJS();
  const size = sizeIm.toJS();

  return im.Map({
    t: center.y - size.y / 2,
    r: center.x + size.x / 2,
    b: center.y + size.y / 2,
    l: center.x - size.x / 2
  });
};
