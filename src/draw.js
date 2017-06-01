;(function(exports) {
  function draw(state, screen) {
    screen.clearRect(0,
                     0,
                     screen.canvas.width,
                     screen.canvas.height);

    drawPlayer(state.get("player"), screen);
    drawDots(state.get("dots"), screen);
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
               player.getIn(["size", "x"]));
  };

  function drawHeading(player, screen) {
    let end = calculateHeadingEnd(player.getIn(["center"]).toJS(),
                                  player.getIn(["angle"]));
    drawLine(screen,
             player.getIn(["center"]).toJS(),
             end,
             0.5,
             "#bbb");
  };

  function calculateHeadingEnd(playerCenter, playerAngle) {
    const LINE_LENGTH = 50;
    let endOffset = Maths.vectorMultiply(Maths.angleToVector(playerAngle),
                                         LINE_LENGTH);
    return Maths.addVectors(playerCenter,
                            endOffset);
  };

  function drawDots(dots, screen) {
    dots.forEach((dot) => drawDot(dot, screen));
  };

  function drawDot(dot, screen) {
    drawCircle(screen,
               dot.getIn(["center"]).toJS(),
               dot.getIn(["size", "x"]));
  };

  function drawCircle(screen, center, radius) {
    screen.beginPath();
    screen.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    screen.closePath();
    screen.fillStyle = "black";
    screen.fill();
  };

  function drawLine(screen, from, to, width, color) {
    screen.beginPath();
    screen.moveTo(from.x, from.y);
    screen.lineTo(to.x, to.y);
    screen.closePath();

    screen.width = width;
    screen.strokeStyle = color;
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
