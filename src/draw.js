;(function(exports) {
  function draw(state, screen) {
    screen.clearRect(0,
                     0,
                     screen.canvas.width,
                     screen.canvas.height);

    drawPlayer(state, screen);
    // if (state.get("isRecentlyClicked")) {
    //   flashScreen(screen);
    // }
  };

  function flashScreen(screen) {
    screen.fillRect(0, 0, screen.canvas.width, screen.canvas.height)
  };

  function drawPlayer(state, screen) {
    drawBody(state, screen);
    drawHeading(state, screen);
  };

  function drawBody(state, screen) {
    drawCircle(screen,
               state.getIn(["player", "position", "x"]),
               state.getIn(["player", "position", "y"]),
               state.getIn(["player", "width"]));
  };

  function drawHeading(state, screen) {
    let end = calculateHeadingEnd(state.getIn(["player", "position"]).toJS(),
                                  state.getIn(["player", "nextAngle"]));
    drawLine(screen,
             state.getIn(["player", "position"]).toJS(),
             end,
             0.5);
  };

  function calculateHeadingEnd(playerCenter, playerAngle) {
    let endOffset = Maths.vectorMultiply(Maths.angleToVector(playerAngle), 20);
    return Maths.addVectors(playerCenter,
                            endOffset);
  };

  function drawCircle(screen, x, y, radius) {
    screen.beginPath();
    screen.arc(x, y, radius, 0, Math.PI * 2, true);
    screen.closePath();
    screen.fillStyle = "black";
    screen.fill();
  };

  function drawLine(screen, from, to, lineWidth) {
    screen.beginPath();
    screen.moveTo(from.x, from.y);
    screen.lineTo(to.x, to.y);
    screen.closePath();

    screen.lineWidth = lineWidth;
    screen.stroke();
  };

  function setupScreen(window) {
    var screen = window
        .document
        .getElementById("screen")
        .getContext("2d");
    screen.canvas.width = window.innerWidth;
    screen.canvas.height = window.innerHeight;
    return screen;
  };

  exports.draw = {
    draw,
    setupScreen
  };
})(this);
