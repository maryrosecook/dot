;(function(exports) {
  const im = Immutable;

  function draw(state, screen) {
    screen.fillStyle = "white";
    screen.fillRect(0,
                    0,
                    screen.canvas.width,
                    screen.canvas.height);

    drawPlayer(state.get("player"), screen);
    drawBullets(state.get("bullets"), screen);
    drawEnemies(state.get("enemies"), screen);
  };

  function flashScreen(screen) {
    screen.fillRect(0, 0, screen.canvas.width, screen.canvas.height)
  };

  function drawPlayer(player, screen) {
    drawBody(player, screen);
  };

  function drawEnemies(enemies, screen) {
    enemies.forEach((enemy) => drawEnemy(enemy, screen));
  };

  function drawEnemy(enemy, screen) {
    screen.fillStyle = "#000";
    drawCircle(screen,
               enemy.getIn(["center"]).toJS(),
               enemy.getIn(["size", "x"]));
  };

  function drawBullets(bullets, screen) {
    bullets.forEach((bullet) => drawBullet(bullet, screen));
  };

  function drawBullet(bullet, screen) {
    screen.fillStyle = "#000";
    drawCircle(screen,
               bullet.getIn(["center"]).toJS(),
               bullet.getIn(["size", "x"]));
  };

  function drawBody(player, screen) {
    const playerSize = player.get("size").toJS();
    const playerCenter = player.get("center").toJS();

    screen.fillStyle = "#000";
    drawCircle(screen,
               playerCenter,
               playerSize.x);


    const eyeCenter = Maths.addVectors(
      playerCenter,
      Maths.multiplyVectors(
        Maths.angleToVector(player.get("angle")),
        playerSize,
        { x: 1, y: 20 }));

    drawCircle(screen,
               eyeCenter,
               player.getIn(["size", "x"]) / 1.5);
  };

  // function drawHeading(player, screen) {
  //   let end = calculateHeadingEnd(player.getIn(["center"]).toJS(),
  //                                 player.getIn(["angle"]));
  //   drawLine(screen,
  //            player.getIn(["center"]).toJS(),
  //            end,
  //            0.5,
  //            "#f00");
  // };

  // function calculateHeadingEnd(playerCenter, playerAngle) {
  //   const LINE_LENGTH = 50;
  //   let endOffset = Maths.vectorMultiply(Maths.angleToVector(playerAngle),
  //                                        LINE_LENGTH);
  //   return Maths.addVectors(playerCenter,
  //                           endOffset);
  // };

  function drawCircle(screen, center, radius) {
    screen.beginPath();
    screen.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
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
    console.log(scale)
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
