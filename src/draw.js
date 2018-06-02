;(function(exports) {
  function draw(state, screen, windowSize) {
    screen.fillStyle = "white";
    screen.fillRect(0,
                    0,
                    screen.canvas.width,
                    screen.canvas.height);

    const scale = getScale(state.get("size"), windowSize);
    drawGame(state, screen, scale, windowSize);
    drawPlayer(state.get("player"), screen, scale);
    drawTokens(state.getIn(["tokens", "tokens"]), screen, scale);
  };

  function drawPlayer(player, screen, scale) {
    drawBody(player, screen, scale);
  };

  function drawTokens(tokens, screen, scale) {
    tokens.forEach((token) => drawToken(token, screen, scale));
  };

  function drawToken(token, screen, scale) {
    const center = token.get("center").toJS();
    const id = token.get("id");

    screen.fillStyle = "#fc0";
    drawCircle(screen,
               token.getIn(["center"]).toJS(),
               token.getIn(["size", "x"]) / 2,
               scale);
    screen.font = "16px courier";
    screen.fillStyle = "#000";
    screen.textAlign = "center";
    screen.fillText(id, center.x * scale, (center.y * scale) + 10 * scale);
  };

  function millisecondsToSeconds(milliseconds) {
    return Math.floor(milliseconds / 1000);
  };

  function drawGame(game, screen, scale, windowSize) {
    const thisTime = millisecondsToSeconds(Date.now() - game.get("startTime"));
    const bestTime = game.get("bestTime") === undefined ?
          "-" :
          millisecondsToSeconds(game.get("bestTime"));

    screen.font = "16px courier";
    screen.textAlign = "left";
    screen.fillStyle = "#000";
    screen.fillText(`THIS ${thisTime}`, 10, 25);
    screen.fillText(`BEST ${bestTime}`, 10, 50);
  };

  function drawBody(player, screen, scale) {
    const playerSize = player.get("size").toJS();
    const playerCenter = player.get("center").toJS();

    screen.fillStyle = "#000";
    drawCircle(screen,
               playerCenter,
               playerSize.x / 2,
               scale);

    const eyeCenter = Maths.addVectors(
      playerCenter,
      Maths.multiplyVectors(
        Maths.angleToVector(player.get("angle")),
        Maths.multiplyVectors(playerSize, { x: 0.3, y: 0.3 })));

    screen.fillStyle = "white";
    drawCircle(screen,
               eyeCenter,
               player.getIn(["size", "x"]) / 6,
               scale);
  };

  function drawCircle(screen, center, radius, scale) {
    screen.beginPath();
    screen.arc(center.x * scale,
               center.y * scale,
               radius * scale,
               0,
               Math.PI * 2,
               true);
    screen.closePath();
    screen.fill();
  };

  function drawLine(screen, from, to, width, color) {
    screen.beginPath();
    screen.moveTo(from.x, from.y);
    screen.lineTo(to.x, to.y);
    screen.closePath();

    screen.lineWidth = width;
    screen.strokeStyle = color;
    screen.stroke();
  };

  function setupScreen(screen, viewSize, windowSize) {
    const scale = getScale(viewSize, windowSize);
    screen.canvas.width = viewSize.get("x") * scale;
    screen.canvas.height = viewSize.get("y") * scale;
  };

  function windowSize(window) {
    return im.Map({ x: window.innerWidth, y: window.innerHeight });
  };

  function getScale(viewSize, windowSize) {
    const horizontalRatio = windowSize.get("x") / viewSize.get("x");
    const verticalRatio = windowSize.get("y") / viewSize.get("y");
    return Math.min(horizontalRatio, verticalRatio);
  };

  exports.draw = {
    draw,
    setupScreen,
    windowSize
  };
})(this);
