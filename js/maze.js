const maze_canvas_name = "maze_canvas";
const maze_canvas = document.getElementById(maze_canvas_name);
const ctx = maze_canvas.getContext("2d");

const min_size = 30;
const start = [0, 0];
const end = [49, 49];

var cellSize;

makeMaze(50); // make the maze at site start up

function makeMaze(size) {
  if (size < min_size) {
    console.log("sizeX is too small (min is " + min_size + ")");
    return;
  }

  cellSize = maze_canvas.width / size;
  
  // create matrix and fill it with walls (1 = wall, 0 = path)
  var maze_matrix = new Array(size);
  for (var i = 0; i < size; i++) {
    maze_matrix[i] = new Array(size);
    for (var j = 0; j < size; j++) {
      maze_matrix[i][j] = 1; // start with all walls
    }
  }

  generateMaze(maze_matrix, start[0], start[1]);
  drawMaze(maze_matrix, size, cellSize);
}

function generateMaze(maze, startX, startY) {
  var currentX = startX;
  var currentY = startY;

  // stack is for backtracking
  var prevMoves = [];
  
  // mark start cell as path
  prevMoves.push([startX, startY]); // remember the first move
  
  var directions = [
    [0, -1], // up
    [1, 0],  // right
    [0, 1],  // down
    [-1, 0]  // left
  ];


  // actual maze algorithm stuff //
  var dir = directions[2];

  var i = 0;
  while (prevMoves.length > 0) { //stack.length > 0
    var prevCoords;

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
      // and make sure we set the walked path as false / walkable
      maze[currentX][currentY] = false;
    }


    i++;
  }

}

function getNewDirection(directions, x, y, maze, oppositeDir) {

  // we start with a random direction
  var firstDirIndex = Math.floor( Math.random() * directions.length );
  var dir = directions[ firstDirIndex ];
  oppositeDir = [ -dir[0], -dir[1] ];

  // check if it is a valid direction
  if (!compareDirections(dir, oppositeDir) && 
      checkBounds(x + dir[0], y + dir[1], maze.length) &&
      checkNeighbors(directions, oppositeDir, x + dir[0], y + dir[1], maze) ) {
    return dir;
  }

  for (var i = 0; i < directions.length; i++) {

    // we go through all remaining directions
    if ( i != firstDirIndex) {
      dir = directions[i];
      oppositeDir = [ -dir[0], -dir[1] ];

      // if a new direction is ok, we return that one
      if (!compareDirections(dir, oppositeDir) && 
      checkBounds(x + dir[0], y + dir[1], maze.length) &&
      checkNeighbors(directions, oppositeDir, x + dir[0], y + dir[1], maze) ) {
        return dir;
      }
    }
  }
  
  // if no directions were ok, we return an empty direction
  return [0, 0];
}



// AUX //
function checkNeighbors(directions, fromDir, x, y, maze) {
  var wallCount = 0;

  var nextX = x;
  var nextY = y;

  for (var i = 0; i < directions.length; i++) {
    if ( compareDirections(directions[i], fromDir) ) { // we don't want to look at the direction we came from
      /*console.log("we will NOT look in this direction:");
      console.log(fromDir[0] + ", " + fromDir[1]);*/
      continue;
    }

    var dir = directions[i];

    nextX = x + dir[0];
    nextY = y + dir[1];

    //console.log(nextX + ", " + nextY);

    if ( !checkBounds(nextX, nextY, maze.length) || maze[nextX][nextY] == 1 ) { // if out of bounds count as wall
      wallCount++;
      
    } else if ( maze[nextX][nextY] == 0 ) {
      /*console.log("another path here, not good");
      console.log(dir[0] + ", " + dir[1]);
      console.log(nextX + ", " + nextY);*/
    }
  }
  //console.log("_________");

  return wallCount >= 3;
}

function compareDirections(dir1, dir2) {
  return dir1[0] == dir2[0] && dir1[1] == dir2[1];
}


// simple array border check
function checkBounds(x, y, arrayLength) {
  if (x >= 0 && y >= 0 && x < arrayLength && y < arrayLength) return true;
  return false;
}



function drawMaze(maze, size, cSize) {
  // Clear canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, maze_canvas.width, maze_canvas.height);
  
  // Draw maze
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      if (maze[x][y] == 1) {
        ctx.fillStyle = "black"; // Wall
      } else {
        ctx.fillStyle = "white"; // Path
      }
      ctx.fillRect(x * cSize, y * cSize, cSize, cSize);
      
      // Mark start and end
      if (x == start[0] && y == start[1]) {
        ctx.fillStyle = "green";
        ctx.fillRect(x * cSize, y * cSize, cSize, cSize);

      } else if (x == end[0] && y == end[1]) {
        ctx.fillStyle = "red";
        ctx.fillRect(x * cSize, y * cSize, cSize, cSize);
      }
    }
  }
}

// safekeeping //

/*
while (stack.length > 0) {
    // Get current cell from stack
    var current = stack[stack.length - 1];
    var [x, y] = current;
    
    // Find unvisited neighbors (two cells away)
    var neighbors = [];
    
    for (var i = 0; i < directions.length; i++) {
      var nx = x + directions[i][0];
      var ny = y + directions[i][1];
      
      // Check if neighbor is within bounds and is a wall
      if (nx >= 0 && nx < maze.length && ny >= 0 && ny < maze[0].length && maze[nx][ny] === 1) {
        neighbors.push([directions[i], i]);
      }
    }
    
    // If there are unvisited neighbors
    if (neighbors.length > 0) {
      // Randomly select one neighbor
      var randomIndex = Math.floor(Math.random() * neighbors.length);
      var [dir, dirIndex] = neighbors[randomIndex];
      
      // Calculate wall cell and new cell
      var wx = x + dir[0] / 2;
      var wy = y + dir[1] / 2;
      var nx = x + dir[0];
      var ny = y + dir[1];
      
      // Carve path through the wall and into the new cell
      maze[wx][wy] = 0; // Remove wall
      maze[nx][ny] = 0; // Mark new cell as path
      
      // Push new cell to stack
      stack.push([nx, ny]);
    } else {
      // Backtrack (pop from stack)
      stack.pop();
    }
  }

function check2DArrayBoundsWithDir(direction, x, y, arrayLength) {
  console.log(x+ ", " + y);
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
  console.log(x+ ", " + y);
  return [x, y];
}

function checkNeighbors(maze, x, y, prevX, prevY) {
  // if up; check left, up, right
  if (y < prevY) {
    if ( checkLeft(maze,x,y) && checkUp(maze,x,y) && checkRight(maze,x,y) ) {
      prevDir = 0;
      return true;
    } else return false;
  }
  // if right; check up, right, down
  else if (x > prevX) {
    if ( checkUp(maze,x,y) && checkRight(maze,x,y) && checkDown(maze,x,y) ) {
      prevDir = 1;
      return true;
    } else return false;
  }
  // if down; check right, down, left
  else if (y > prevY) {
    if ( checkRight(maze,x,y) && checkDown(maze,x,y) && checkLeft(maze,x,y)) {
      prevDir = 2;
      return true;
    } else return false;
  }
  // if left; check down, left, up
  else if (x < prevX) {
    if ( checkDown(maze,x,y) && checkLeft(maze,x,y) && checkUp(maze,x,y)) {
      prevDir = 3;
      return true;
    } else return false;
  }
}
*/