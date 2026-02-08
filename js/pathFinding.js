function pathFind() {
  var grid = new PF.Grid(maze_matrix);
  var pathFinder = new PF.AStarFinder();

  // path[0] = Y
  // path[1] = X
  var path = pathFinder.findPath(start[0], start[1], end[0], end[1], grid);

  drawSolution(path, cellSize);
}

function toggleSolution() {
  showSolution = !showSolution;
}

function drawSolution(path, cSize) {
  if (!showSolution) {
    pathCtx.clearRect(0, 0, path_canvas.width, path_canvas.height);
    return;
  }

  var offset = cSize * 0.3;

  pathCtx.fillStyle = m_solution_color;

  let startX = path[0][1];
  let startY = path[0][0];

  let prevX = startX;
  let prevY = startY;

  let dirX = path[1][1] - startX;
  let dirY = path[1][0] - startY;

  for (let i = 1; i < path.length; i++) {

    let x = path[i][1];
    let y = path[i][0];

    let newDirX = x - prevX;
    let newDirY = y - prevY;

    // direction changed → draw segment
    if (newDirX !== dirX || newDirY !== dirY) {

      pathCtx.fillRect(
        Math.min(startX, prevX) * cSize + offset,
        Math.min(startY, prevY) * cSize + offset,
        (Math.abs(prevX - startX) + 1) * cSize - offset * 2,
        (Math.abs(prevY - startY) + 1) * cSize - offset * 2
      );

      startX = prevX;
      startY = prevY;

      dirX = newDirX;
      dirY = newDirY;
    }

    prevX = x;
    prevY = y;
  }

  // draw last segment
  pathCtx.fillRect(
    Math.min(startX, prevX) * cSize + offset,
    Math.min(startY, prevY) * cSize + offset,
    (Math.abs(prevX - startX) + 1) * cSize - offset * 2,
    (Math.abs(prevY - startY) + 1) * cSize - offset * 2
  );

  // start
  pathCtx.fillStyle = "green";
  pathCtx.fillRect(start[0] * cSize, start[1] * cSize, cSize, cSize);

  // end
  pathCtx.fillStyle = "red";
  pathCtx.fillRect(end[0] * cSize, end[1] * cSize, cSize, cSize);
}
