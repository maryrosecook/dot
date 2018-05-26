;(function(exports) {
  const im = Immutable;

  function draw(state, screen, windowSize) {
    screen.fillStyle = "white";
    screen.fillRect(0,
                    0,
                    screen.canvas.width,
                    screen.canvas.height);

    const scale = getScale(state.get("viewSize"), windowSize);
    drawPlayer(state.get("player"), screen, scale);
    drawBullets(state.get("bullets"), screen, scale);
    drawEnemies(state.get("enemies"), screen, scale);
  };

  function drawPlayer(player, screen, scale) {
    drawBody(player, screen, scale);
  };

  function drawEnemies(enemies, screen, scale) {
    enemies.forEach((enemy) => drawEnemy(enemy, screen, scale));
  };

  function drawEnemy(enemy, screen, scale) {
    screen.fillStyle = "#000";
    drawCircle(screen,
               enemy.getIn(["center"]).toJS(),
               enemy.getIn(["size", "x"]),
               scale);
  };

  function drawBullets(bullets, screen, scale) {
    bullets.forEach((bullet) => drawBullet(bullet, screen, scale));
  };

  function drawBullet(bullet, screen, scale) {
    screen.fillStyle = "#000";
    drawCircle(screen,
               bullet.getIn(["center"]).toJS(),
               bullet.getIn(["size", "x"]),
               scale);
  };

  function drawBody(player, screen, scale) {
    const playerSize = player.get("size").toJS();
    const playerCenter = player.get("center").toJS();

    screen.fillStyle = "#000";
    drawCircle(screen,
               playerCenter,
               playerSize.x,
               scale);

    const eyeCenter = Maths.addVectors(
      playerCenter,
      Maths.multiplyVectors(
        Maths.angleToVector(player.get("angle")),
        playerSize,
        { x: 1, y: 20 }));

    drawCircle(screen,
               eyeCenter,
               player.getIn(["size", "x"]) / 1.5,
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
