;(function(exports) {
  var im = Immutable;

  function collisions(bodies) {
    return bodyPairs(bodies)
      .filter(bodyPair => isPairColliding(bodyPair.get(0), bodyPair.get(1)))
      .map(bodyPair => {
        return message(
          "collision",
          im.List([bodyPair.get(0), bodyPair.get(1)])
        );
      });
  };

  function isHit(body, messages) {
    return messages
      .filter(message.isType("collision"))
      .find(message => message.get("data").includes(body));
  };

  function isPairColliding(body1, body2) {
    return Maths.distance(
      body1.get("center").toJS(), body2.get("center").toJS()) <
      body1.getIn(["size", "x"]) + body2.getIn(["size", "x"]);
  };

  function bodyPairs(bodies) {
    let pairs = [];
    for (let i = 0; i < bodies.count(); i++) {
      for (let j = i + 1; j < bodies.count(); j++) {
        const body1 = bodies.get(i);
        const body2 = bodies.get(j);
        pairs.push(im.List([body1, body2]));
      }
    }

    return im.List(pairs);
  };

  collisions.isHit = isHit;
  exports.collisions = collisions;
})(this);
