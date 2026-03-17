const inputSpeed = 100;

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

var playerDirs = [
  [0, -1], // up
  [1, 0],  // right
  [0, 1],  // down
  [-1, 0]  // left
];

let inputLoop = null;

playerCtx.fillStyle = m_player_color;
function checkInput() {

  // 1. EXIT EARLY if game is over
  if (isGameOver) return;

  var dir = null; // Use null to start

  if (keys.w || keys.ArrowUp) dir = playerDirs[0];
  else if (keys.d || keys.ArrowRight) dir = playerDirs[1];
  else if (keys.s || keys.ArrowDown) dir = playerDirs[2];
  else if (keys.a || keys.ArrowLeft) dir = playerDirs[3];
  
  if (dir == null) return;

  // 2. Start timer ONLY on the first move
  if (!gameStarted) {
    gameStarted = true;
    gameTimer.start();
  }
  
  // 3. Movement Logic
  if (checkArrBounds(playerX + dir[0], playerY + dir[1], maze_matrix.length) &&
      !checkNextPlayerCell(playerX + dir[0], playerY + dir[1], maze_matrix) ) {
    
    playerX += dir[0];
    playerY += dir[1];

    if (playerX == end[0] && playerY == end[1]) {
      gameTimer.pause();
      showVictory();
    }
  }
}

// AUX //
function checkNextPlayerCell(nextX, nextY, maze) {
  return maze[nextX][nextY] == true;
}

function checkArrBounds(x, y, arrayLength) {
  if (x >= 0 && y >= 0 && x < arrayLength && y < arrayLength) return true;
  return false;
}


// VERY IMPORTANT, this is used to calculate delta, so the movement is the same across refreshrates :D
var lastTime = 0;
function animatePlayer(currentTime) {
  delta = (currentTime - lastTime) / 1000; 
  lastTime = currentTime;

  const speed = 13; // not a scientific value, it just feels nice 
  const correctSpeed = speed * delta;

  renderX += (playerX - renderX) * correctSpeed;
  renderY += (playerY - renderY) * correctSpeed;

  drawPlayer();

  requestAnimationFrame(animatePlayer);
}

// Start the loop
requestAnimationFrame(animatePlayer);

function restartGame() {
  isGameOver = false;
  gameStarted = false;
  gameTimer.reset();
  makeMaze();
  drawPlayer();
}



window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

setInterval(checkInput, inputSpeed);
