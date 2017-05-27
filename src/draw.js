;(function(exports) {
  function draw(state, screen) {
    screen.clearRect(0,
                     0,
                     screen.canvas.width,
                     screen.canvas.height);

    drawPlayer(state.get("player"), screen);
  };

  function flashScreen(screen) {
    screen.fillRect(0, 0, screen.canvas.width, screen.canvas.height)
  };

  function drawPlayer(player, screen) {
    drawBody(player, screen);
    drawHeading(player, screen);
  };

  function drawBody(player, screen) {
    drawCircle(screen,
               player.getIn(["center"]).toJS(),
               player.getIn(["width"]));
  };

  function drawHeading(player, screen) {
    let end = calculateHeadingEnd(player.getIn(["center"]).toJS(),
                                  player.getIn(["nextAngle"]));
    drawLine(screen,
             player.getIn(["center"]).toJS(),
             end,
             0.5);
  };

  function calculateHeadingEnd(playerCenter, playerAngle) {
    const LINE_LENGTH = 50;
    let endOffset = Maths.vectorMultiply(Maths.angleToVector(playerAngle),
                                         LINE_LENGTH);
    return Maths.addVectors(playerCenter,
                            endOffset);
  };

  function drawCircle(screen, center, radius) {
    screen.beginPath();
    screen.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
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
