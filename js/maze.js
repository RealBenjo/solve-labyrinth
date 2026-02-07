const maze_canvas_name = "maze_canvas";

const maze_canvas = document.getElementById(maze_canvas_name);
const ctx = maze_canvas.getContext("2d");

const start = [0, 0];
const mazeEndBias = 0.3; // needs to be between 0.0 - 1.0
var canMazeGen = true
var end = [size-1, size-1];
var mazeSize = size;
var start_to_end = distanceBetween(start[0], start[1], end[0], end[1]);

maze_canvas.width = 500;
maze_canvas.height = 500;

var cellSize;
var currentGeneration = 0; // increment to cancel running generation

function stopCurrentMazeGen() {
  // bump generation id to cancel any running generation and allow a new one
  currentGeneration++;
  canMazeGen = true;
}

makeMaze(); // make the maze at site start up
async function makeMaze() {
  // if maze is being generated, prevent another one being generated
  if (!canMazeGen) {
    return;
  } else {
    mazeSize = size;
    canMazeGen = false;
  }
  
  // get the size value from user
  end = [mazeSize-1, mazeSize-1];
  
  cellSize = maze_canvas.width / mazeSize;
  
  // create matrix and fill it with walls (true = wall, false = path)
  var maze_matrix = new Array(mazeSize);
  for (var i = 0; i < mazeSize; i++) {
    maze_matrix[i] = new Array(mazeSize);
    for (var j = 0; j < mazeSize; j++) {
      maze_matrix[i][j] = true; // start with all walls
    }
  }
  
  // start generation: bump id so older runs stop, capture id for this run
  const myGenId = ++currentGeneration;
  await generateMaze(maze_matrix, start[0], start[1], myGenId);
  drawMaze(maze_matrix, mazeSize, cellSize);

  canMazeGen = true;
}

async function generateMaze(maze, startX, startY, genId) {
  start_to_end = distanceBetween(start[0], start[1], end[0], end[1]);
  
  var currentX = startX;
  var currentY = startY;

  // prevMoves is for backtracking
  var allMoves = [];
  
  // mark start cell as path
  maze[startX][startY] = false;
  allMoves.push([startX, startY]); // remember the first move
  
  var directions = [
    [0, -2], // up
    [2, 0],  // right
    [0, 2],  // down
    [-2, 0]  // left
  ];

  maze[startX][startY] == false;


  // actual maze algorithm stuff //

  // when we backtrack to the start we end the algorithm
  while (allMoves.length > 0) {
    // if another generation was requested, abort this run
    if (genId !== currentGeneration) return;


    var newCoords = new Array(); // used for backtracking

    dir = getNewDirection(directions, currentX, currentY, maze);

    // check if the direction we are given is null
    if ( dir == null ) {
      // if so, we know we need to go back (from start -> end)
      newCoords = allMoves[0];
      allMoves.splice(0, 1);

      // we backtrack here:
      currentX = newCoords[0];
      currentY = newCoords[1];

    } else { 

      // if the direction is in fact valid, we move there
      currentX += dir[0];
      currentY += dir[1];
      // we also save it in memory
      allMoves.push([currentX, currentY]);

      // set the inbetween path to false also
      maze = fillTheBlanks(dir, currentX, currentY, maze);

      // set the current x and y coords as a walked path -> false / walkable
      maze[currentX][currentY] = false;

      
      
      if (typeof showMazeGen !== 'undefined' ? showMazeGen : false) {
        drawMaze(maze, mazeSize, cellSize);
        await wait(speed); // in miliseconds
        if (genId !== currentGeneration) return;
      }
    }
  }
}

function getNewDirection(directions, x, y, maze) {
  var biasedDirs = new Array();
  var otherDirs = new Array();

  // we cycle through all directions and pick only the valid ones
  directions.forEach(dir => {
    if (checkArrayBounds(x + dir[0], y + dir[1], maze.length) &&
        checkNextCell(x + dir[0], y + dir[1], maze)) {
      
      // we check if the next pos is closer to the end than the current pos
      if ( distanceBetween([x,y], end) > distanceBetween([x + dir[0], y + dir[1]], end) ) {
        biasedDirs.push(dir);
      }

      otherDirs.push(dir);
    }
  });

  if ( mazeEndBias > Math.random() && biasedDirs.length > 0 ) {
    return biasedDirs[ Math.floor( Math.random() * otherDirs.length ) ];
  
  // move to another random direction
  } else if ( otherDirs.length > 0 ) {
    return otherDirs[ Math.floor( Math.random() * otherDirs.length ) ];

  } else {
    return null; // otherwise, tell the algorithm to backtrack
  }
}



// AUX //
function checkNextCell(nextX, nextY, maze) {
  return maze[nextX][nextY] == true;
}

function fillTheBlanks(dir, x, y, maze) {
  // if no change in x axis
  if ( dir[0] == 0 ) {
    // if y axis went down
    if ( dir[1] > 0 ) {
      // set the one above to false
      maze[x][y - 1] = false;
    }
    
    // if the y axis went up
    else {
      // set the one below to false
      maze[x][y + 1] = false;
    }
  }

  // if no change in y axis
  else {
    // if x axis went left
    if ( dir[0] > 0 ) {
      // set the one above to false
      maze[x - 1][y] = false;
    }
    
    // if the x axis went right
    else {
      // set the one below to false
      maze[x + 1][y] = false;
    }
  }

  return maze;
}

function compareDirections(dir1, dir2) {
  return dir1[0] == dir2[0] && dir1[1] == dir2[1];
}

function checkArrayBounds(x, y, arrayLength) {
  if (x >= 0 && y >= 0 && x < arrayLength && y < arrayLength) return true;
  return false;
}

function distanceBetween(pos1, pos2) {
  return Math.sqrt( Math.pow( pos2[0]-pos1[0], 2 ) + Math.pow( pos2[1]-pos1[1], 2 ) );
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



// chatGPT code down here //

function drawMaze(maze, mSize, cSize) {
  // clear canvas
  ctx.fillStyle = m_wall_color;
  ctx.fillRect(0, 0, maze_canvas.width, maze_canvas.height);

  // paths
  ctx.fillStyle = m_path_color;
  drawHorizontalPaths(maze, mSize, cSize);
  drawVerticalPaths(maze, mSize, cSize);

  // start
  ctx.fillStyle = "green";
  ctx.fillRect(start[0] * cSize, start[1] * cSize, cSize, cSize);

  // end
  ctx.fillStyle = "red";
  ctx.fillRect(end[0] * cSize, end[1] * cSize, cSize, cSize);
}

// MAZE RENDERING AUX //
function drawHorizontalPaths(maze, mSize, cSize) {
  for (let y = 0; y < mSize; y+=2) {
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
  for (let x = 0; x < mSize; x+=2) {
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
