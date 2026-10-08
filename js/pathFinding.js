function pathFind() {
  // Convert boolean maze_matrix[x][y] to 0/1 PF format matrix[y][x]
  // (0 = walkable, 1 = wall)
  const pfMatrix = [];
  for (let y = 0; y < mazeSize; y++) {
    pfMatrix[y] = [];
    for (let x = 0; x < mazeSize; x++) {
      pfMatrix[y][x] = maze_matrix[x][y] ? 1 : 0;
    }
  }

  var grid = new PF.Grid(pfMatrix);
  var pathFinder = new PF.AStarFinder();

  // findPath expects (startX, startY, endX, endY, grid)
  var path = pathFinder.findPath(
    player_pos.x,
    player_pos.y,
    end.x,
    end.y,
    grid
  );

  drawSolution(path, cellSize);
}

function toggleSolution() {
  showSolution = !showSolution;
}

function drawSolution(path, cSize) {
  if (!showSolution || !path || path.length === 0) {
    pathCtx.clearRect(0, 0, path_canvas.width, path_canvas.height);
    return;
  }

  var offset = cSize * 0.3;

  pathCtx.fillStyle = m_solution_color;

  // Path nodes are now standard [x, y]
  let startX = path[0][0];
  let startY = path[0][1];

  let prevX = startX;
  let prevY = startY;

  let dirX = path[1] ? path[1][0] - startX : 0;
  let dirY = path[1] ? path[1][1] - startY : 0;

  for (let i = 1; i < path.length; i++) {
    let x = path[i][0];
    let y = path[i][1];

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
  pathCtx.fillStyle = m_start_color;
  pathCtx.fillRect(start.x * cSize, start.y * cSize, cSize, cSize);

  // end
  pathCtx.fillStyle = m_end_color;
  pathCtx.fillRect(end.x * cSize, end.y * cSize, cSize, cSize);
}