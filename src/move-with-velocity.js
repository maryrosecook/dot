function moveWithVelocity(_, state) {
  return state.update("center", (center) => {
    return im.Map(
      Maths.addVectors(
        center.toJS(), state.get("velocity").toJS()));
  });
};
