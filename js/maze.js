const maze_canvas_name = "maze_canvas";
const maze_canvas = document.getElementById(maze_canvas_name);
const ctx = maze_canvas.getContext("2d");


const min_size = 30;
const start = [0, 0];
const end = [49, 49]; // only if 50 x 50 maze!!!

var cellSize; // maze cell size in pixels

makeMaze(50); // make the maze at site start up

function makeMaze(size) {
  // simply catch too small maze size
  if (size < min_size) {
    console.log("sizeX is too small (min is " + min_size + ")");
    return
  }

  // get the correct cellsize
  cellSize = maze_canvas.width / size;
  

  // create matrix and fill it with 1 (true / blocked)
  var maze_matrix = new Array(size);
  for (var i = 0; i < size; i++) {
    maze_matrix[i] = new Array(size);
  }

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      maze_matrix[i][j] = true;
    }
  }

  generateMaze(maze_matrix, start[0], start[1], end[0], end[1]);

  drawMaze(maze_matrix, size, cellSize);
}


function generateMaze(maze, startX, startY, endX, endY) {
  var nextCoords = new Array;

  var currentX = startX;
  var currentY = startY;

  // when the algorithm goes one step further to check if it is a valid spot it uses these two vars
  var nextX = currentX;
  var nextY = currentY;

  // set the start to 0 (true / walkable)
  maze[currentX][currentY] = 0;

  var dir = 0;
  var i = 0;
  while (i < 5000) { //currentX != endX || currentY != endY

    // make a random direction
    dir = Math.floor( Math.random() * 4 );

    nextCoords = check2DArrayBounds(dir, nextX, nextY, maze.length);
    nextX = nextCoords[0];
    nextY = nextCoords[1];

    maze[nextX][nextY] = 0;

    i++;
  }
}



// AUX //
function check2DArrayBounds(direction, x, y, arrayLength) {
  switch (direction) {
    // up
    case 0:
      if (y - 1 >= 0) y--;
      break;

    // right
    case 1:
      if (x + 1 < arrayLength) x++;
      break;

    // down
    case 2:
      if (y + 1 < arrayLength) y++;
      break;

    // left
    case 3:
      if (x - 1 >= 0) x--;
      break;
  }
  return [x, y];
}



function drawMaze(maze, size, cSize) {
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      // gets the info from the matrix and sets the color for said cell
      // it then draws a rectangle that uses said color
      ctx.fillStyle = maze[x][y] ? "black" : "blue";
      ctx.fillRect( x * cSize, y * cSize, cSize, cSize );
    }
  }
}
