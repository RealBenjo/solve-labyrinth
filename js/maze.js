const maze_canvas_name = "maze_canvas";

const maze_canvas = document.getElementById(maze_canvas_name);
const ctx = maze_canvas.getContext("2d");

const start = [0, 0];
var mazeSize = size;
var end = [mazeSize-1, mazeSize-1];

var showGen = showGeneration;

var cellSize;

makeMaze(mazeSize); // make the maze at site start up

function makeMaze() {

  // take these inputs only when make maze is run
  showGen = showGeneration;

  // get the size value from user
  mazeSize = size;
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

  generateMaze(maze_matrix, start[0], start[1]);
  drawMaze(maze_matrix, mazeSize, cellSize);
}

async function generateMaze(maze, startX, startY) {
  var currentX = startX;
  var currentY = startY;

  // stack is for backtracking
  var prevMoves = [];
  
  // mark start cell as path
  prevMoves.push([startX, startY]); // remember the first move
  
  var directions = [
    [0, -2], // up
    [2, 0],  // right
    [0, 2],  // down
    [-2, 0]  // left
  ];

  maze[startX][startY] == false;


  // actual maze algorithm stuff //

  // this does not actually force the maze in a downwards start, don't worry
  var dir = directions[2];

  // when we backtrack to the start we end the algorithm
  while (prevMoves.length > 0) {
    var prevCoords; // used for backtracking

    // inverts the previous valid direction
    var oppositeDir = [ -dir[0], -dir[1] ];
    dir = getNewDirection(directions, currentX, currentY, maze, oppositeDir);

    // check if the direction we are given is "empty" (aka: [0,0] )
    if ( dir[0] == 0 && dir[1] == 0 ) {
      // if so, we know the direction was invalid and we need to backtrack
      prevCoords = prevMoves.pop();

      // we backtrack here:
      currentX = prevCoords[0];
      currentY = prevCoords[1];

    } else { // if the direction is in fact valid, we move there

      currentX += dir[0];
      currentY += dir[1];
  
      // we also save it in memory
      prevMoves.push([currentX, currentY]);

      // set the inbetween path to false also
      maze = fillTheBlanks(dir, currentX, currentY, maze);

      // set the current x and y coords as a walked path -> false / walkable
      maze[currentX][currentY] = false;

      if (showGen) {
        drawMaze(maze, size, cellSize);
        await wait(speed); // in miliseconds
      }
    }
  }
}

function getNewDirection(directions, x, y, maze, oppositeDir) {
  var validDirs = new Array();

  directions.forEach(dir => {
    if ( !compareDirections(dir, oppositeDir) ) {
      if( checkBounds(x + dir[0], y + dir[1], maze.length) && checkNextCell(x + dir[0], y + dir[1], maze) ) {
        validDirs.push(dir);
      }
    }
  });

  if ( validDirs.length > 0 ) {
    return validDirs[ Math.floor( Math.random() * validDirs.length ) ];
  } else {
    return [0, 0]; // this tells the algorithm there are no valid directions -> we backtrack
  }
}



// AUX //
function checkNextCell(nextX, nextY, maze) {
  // this line could probably be avoided
  // but i don't how to fix the maze looping on itself (if it gets to the starting coordinates) in a cleaner way.
  // oh well...
  if (nextX == start[0] && nextY == start[1]) return false;
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

// simple array border check
function checkBounds(x, y, arrayLength) {
  if (x >= 0 && y >= 0 && x < arrayLength && y < arrayLength) return true;
  return false;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



// chatGPT code down here //

function drawMaze(maze, size, cSize) {
  // clear canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, maze_canvas.width, maze_canvas.height);

  drawHorizontalPaths(maze, size, cSize);
  drawVerticalPaths(maze, size, cSize);

  // start
  ctx.fillStyle = "green";
  ctx.fillRect(start[0] * cSize, start[1] * cSize, cSize, cSize);

  // end
  ctx.fillStyle = "red";
  ctx.fillRect(end[0] * cSize, end[1] * cSize, cSize, cSize);
}

// MAZE RENDERING AUX //
function drawHorizontalPaths(maze, size, cSize) {
  ctx.fillStyle = "white";

  for (let y = 0; y < size; y++) {
    let x = 0;

    while (x < size) {
      if (maze[x][y] === false) {
        let startX = x;

        // extend to the right
        while (x < size && maze[x][y] === false) {
          x++;
        }

        let width = x - startX;

        ctx.fillRect(
          startX * cSize,
          y * cSize,
          width * cSize,
          cSize
        );
      } else {
        x++;
      }
    }
  }
}

function drawVerticalPaths(maze, size, cSize) {
  ctx.fillStyle = "white";

  for (let x = 0; x < size; x++) {
    let y = 0;

    while (y < size) {
      if (maze[x][y] === false) {
        let startY = y;

        // extend downward
        while (y < size && maze[x][y] === false) {
          y++;
        }

        let height = y - startY;

        ctx.fillRect(
          x * cSize,
          startY * cSize,
          cSize,
          height * cSize
        );
      } else {
        y++;
      }
    }
  }
}
