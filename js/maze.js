const min_size = 30;

const maze_canvas_name = "maze_canvas";
const maze_canvas = document.getElementById(maze_canvas_name);
const ctx = maze_canvas.getContext("2d");
const cellSize = 20; // maze cell size in pixels


function generateMaze(sizeX, sizeY) {
  // simply catch too small maze size
  if (sizeX < min_size) {
    console.log("sizeX is too small (min is " + min_size + ")");
    return
  } else if (sizeY < min_size) {
    console.log("sizeY is too small (min is " + min_size + ")");
    return
  }

  // update the canvas's size
  maze_canvas.width  = sizeX * cellSize;
  maze_canvas.height = sizeY * cellSize;
  

  // create matrix and fill it (randomly for now)
  var maze_matrix = new Array(sizeX);
  for (var i = 0; i < sizeX; i++) {
    maze_matrix[i] = new Array(sizeY);
  }

  for (var i = 0; i < sizeX; i++) {
    for (var j = 0; j < sizeY; j++) {
      maze_matrix[i][j] = Math.random() < 0.5;
    }
  }

  drawMaze(maze_matrix, sizeX, sizeY, cellSize);
}



function drawMaze(maze, sizeX, sizeY, cSize) {
  const ctx = maze_canvas.getContext("2d");

  maze_canvas.width  = sizeX * cSize;
  maze_canvas.height = sizeY * cSize;

  for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
      // gets the info from the matrix and sets the color for said cell
      // it then draws a rectangle that uses said color
      ctx.fillStyle = maze[x][y] ? "blue" : "black";
      ctx.fillRect( x * cSize, y * cSize, cSize, cSize );
    }
  }
}
