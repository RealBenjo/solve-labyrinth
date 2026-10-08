const start = new Vector2(0, 0);
const mazeEndBias = 0.3; // needs to be between 0.0 - 1.0
var canMazeGen = true;
var end = generateEnd();
var mazeSize = size;
var start_to_end = distanceBetween(start, end);

// player coordinates
var player_pos = start.clone();
var renderPosition = player_pos.clone();

var maze_matrix = new Array();

var cellSize;
var currentGeneration = 0; // increment to cancel running generation

function stopCurrentMazeGen() {
  // bump generation id to cancel any running generation and allow a new one
  currentGeneration++;
  canMazeGen = true;
}

makeMaze(); // make the maze at site start up
drawPlayer(); // draw the player at site start up

async function makeMaze() {
  // if maze is being generated, prevent another one being generated
  if (!canMazeGen) {
    return;
  } else {
    mazeSize = size;
    canMazeGen = false;
  }

  gameTimer.updateSettings(curDifficulty);
  time_display.innerHTML = curDifficulty.toFixed(2) + "s";

  // by default we don't want the user to see the solution to the maze
  showSolution = false;
  
  pathCtx.clearRect(0, 0, path_canvas.width, path_canvas.height);
  player_pos = start.clone();
  renderPosition = start.clone();

  // get the size value from user
  end = generateEnd();
  
  cellSize = maze_canvas.width / mazeSize;
  
  // create matrix and fill it with walls (true = wall, false = path)
  maze_matrix = new Array(mazeSize);
  for (var i = 0; i < mazeSize; i++) {
    maze_matrix[i] = new Array(mazeSize);

    for (var j = 0; j < mazeSize; j++) {
      maze_matrix[i][j] = true; // start with all walls
    }
  }
  
  // start generation: bump id so older runs stop, capture id for this run
  const myGenId = ++currentGeneration;
  await generateMaze(maze_matrix, start.clone(), myGenId);
  drawMaze(maze_matrix, mazeSize, cellSize);

  canMazeGen = true;
}

async function generateMaze(maze, start_pos, genId) {
  start_to_end = distanceBetween(start_pos, end);
  
  var currentPosition = start_pos.clone();

  // prevMoves is for backtracking
  var allMoves = [];
  
  // mark start cell as path
  maze[start.x][start.y] = false;
  allMoves.push(start.clone()); // remember the first move
  
  var directions = [
    new Vector2(0, -2), // up
    new Vector2(2, 0),  // right
    new Vector2(0, 2),  // down
    new Vector2(-2, 0)  // left
  ];

  // actual maze algorithm stuff //

  // when we backtrack to the start we end the algorithm
  while (allMoves.length > 0) {
    // if another generation was requested, abort this run
    if (genId !== currentGeneration) return;

    var newCoords = new Array(); // used for backtracking

    var dir = getNewDirection(directions, currentPosition, maze);

    // check if the direction we are given is null
    if (dir == null) {
      // if so, we know we need to go back (from start -> end)
      newCoords = allMoves[0];
      allMoves.splice(0, 1);

      // we backtrack here:
      currentPosition = newCoords.clone();

    } else { 
      // set the inbetween path to false also
      maze = fillTheBlanks(dir, currentPosition.x, currentPosition.y, maze);

      // position.add(dir) returns a NEW Vector2 (immutable)
      currentPosition = currentPosition.add(dir);
      
      // save in memory
      allMoves.push(currentPosition.clone());

      // set the current x and y coords as a walked path -> false / walkable
      maze[currentPosition.x][currentPosition.y] = false;

      if (typeof showMazeGen !== 'undefined' ? showMazeGen : false) {
        drawMaze(maze, mazeSize, cellSize);
        await wait(speed); // in miliseconds
        if (genId !== currentGeneration) return;
      }
    }
  }
}

function getNewDirection(directions, position, maze) {
  var biasedDirs = new Array();
  var otherDirs = new Array();

  // we cycle through all directions and pick only the valid ones
  directions.forEach(dir => {
    const nextPos = position.add(dir);

    if (checkArrayBounds(nextPos, maze.length) && checkNextCell(nextPos, maze)) {
      // we check if the next pos is closer to the end than the current pos
      if (distanceBetween(position, end) > distanceBetween(nextPos, end)) {
        biasedDirs.push(dir);
      }

      otherDirs.push(dir);
    }
  });

  if (mazeEndBias > Math.random() && biasedDirs.length > 0) {
    return biasedDirs[Math.floor(Math.random() * biasedDirs.length)];
  
  // move to another random direction
  } else if (otherDirs.length > 0) {
    return otherDirs[Math.floor(Math.random() * otherDirs.length)];

  } else {
    return null; // otherwise, tell the algorithm to backtrack
  }
}

// AUX //
function checkNextCell(next_position = new Vector2(), maze) {
  return maze[next_position.x][next_position.y];
}

function fillTheBlanks(dir, x, y, maze) {
  // if no change in x axis
  if (dir.x == 0) {
    // if y axis went down
    if (dir.y > 0) {
      maze[x][y + 1] = false;
    }
    // if the y axis went up
    else {
      maze[x][y - 1] = false;
    }
  }
  // if no change in y axis
  else {
    // if x axis went right
    if (dir.x > 0) {
      maze[x + 1][y] = false;
    }
    // if x axis went left
    else {
      maze[x - 1][y] = false;
    }
  }

  return maze;
}

function compareDirections(dir1, dir2) {
  return dir1.x == dir2.x && dir1.y == dir2.y;
}

function checkArrayBounds(position = new Vector2(), arrayLength) {
  return (
    position.x >= 0 && 
    position.y >= 0 && 
    position.x < arrayLength && 
    position.y < arrayLength
  );
}

function distanceBetween(pos1 = new Vector2(), pos2 = new Vector2()) {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}

function generateEnd() {
  return new Vector2(mazeSize - 1, mazeSize - 1);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawPlayer() {
  playerCtx.clearRect(0, 0, player_canvas.width, player_canvas.height);

  // Use renderPosition directly with cellSize math
  var temp = renderPosition.multiply(cellSize).add(cellSize * 0.5);
  
  playerCtx.beginPath();
  playerCtx.arc(
    temp.x,
    temp.y,
    cellSize / 3,
    0,
    2 * Math.PI
  );

  playerCtx.fillStyle = m_player_color;
  playerCtx.fill();
}


////////////////////////////
// chatGPT code down here //
////////////////////////////

function drawMaze(maze, mSize, cSize) {
  // clear canvas
  ctx.fillStyle = m_wall_color;
  ctx.fillRect(0, 0, maze_canvas.width, maze_canvas.height);

  // paths
  ctx.fillStyle = m_path_color;
  drawHorizontalPaths(maze, mSize, cSize);
  drawVerticalPaths(maze, mSize, cSize);

  // start
  ctx.fillStyle = m_start_color;
  ctx.fillRect(start.x * cSize, start.y * cSize, cSize, cSize);

  // end
  ctx.fillStyle = m_end_color;
  ctx.fillRect(end.x * cSize, end.y * cSize, cSize, cSize);
}

// MAZE RENDERING AUX //
function drawHorizontalPaths(maze, mSize, cSize) {
  for (let y = 0; y < mSize; y++) {
    let x = 0;

    while (x < mSize) {
      if (maze[x][y] == false) {
        let startX = x;

        // extend to the right
        while (x < mSize && maze[x][y] == false) {
          x++;
        }

        let width = x - startX;

        ctx.fillRect(startX * cSize, y * cSize, width * cSize, cSize);
      } else {
        x++;
      }
    }
  }
}

function drawVerticalPaths(maze, mSize, cSize) {
  for (let x = 0; x < mSize; x++) {
    let y = 0;

    while (y < mSize) {
      if (maze[x][y] == false) {
        let startY = y;

        // extend downward
        while (y < mSize && maze[x][y] == false) {
          y++;
        }

        let height = y - startY;

        ctx.fillRect(x * cSize, startY * cSize, cSize, height * cSize);
      } else {
        y++;
      }
    }
  }
}