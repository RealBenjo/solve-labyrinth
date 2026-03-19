// names of the needed color HTML elements
const m_path_color_div_name = "m_path_color";
const m_wall_color_div_name = "m_wall_color";
const m_solution_color_div_name = "m_solution_color";
const m_player_color_div_name = "m_player_color";
const m_start_color_div_name = "m_start_color";
const m_end_color_div_name = "m_end_color";

const size_display_name = "size_display";
const gen_speed_name = "speed_input";
const show_gen_name = "gen_show_input";
const maze_canvas_name = "maze_canvas";
const path_canvas_name = "path_canvas";
const player_canvas_name = "player_canvas";
const param_dev_name = "param_container_dev";
const param_usr_name = "param_container_usr";
const time_display_name = "time_display";
const difficulty_container_name = "difficulty_container";

// actual HTML elements
const size_display = document.getElementById(size_display_name);
const gen_speed = document.getElementById(gen_speed_name);
const show_gen = document.getElementById(show_gen_name);
const time_display = document.getElementById(time_display_name);
const param_dev = document.getElementById(param_dev_name);
const param_usr = document.getElementById(param_usr_name);
const difficulties = document.getElementById(difficulty_container_name).children; // all difficulty buttons
const path_canvas = document.getElementById(path_canvas_name);
const pathCtx = path_canvas.getContext("2d");
const maze_canvas = document.getElementById(maze_canvas_name);
const ctx = maze_canvas.getContext("2d");
const player_canvas = document.getElementById(player_canvas_name);
const playerCtx = player_canvas.getContext("2d");

const mazeCanvasSize = 500; // self explanatory

maze_canvas.width = mazeCanvasSize;
maze_canvas.height = mazeCanvasSize;
player_canvas.width = mazeCanvasSize;
player_canvas.height = mazeCanvasSize;
path_canvas.width = mazeCanvasSize;
path_canvas.height = mazeCanvasSize;

// colors from css
const m_path_color = getComputedStyle( document.getElementById(m_path_color_div_name) ).getPropertyValue("--maze-path-color");
const m_wall_color = getComputedStyle( document.getElementById(m_wall_color_div_name) ).getPropertyValue("--maze-wall-color");
const m_solution_color = getComputedStyle( document.getElementById(m_solution_color_div_name) ).getPropertyValue("--maze-solution-color");
const m_player_color = getComputedStyle( document.getElementById(m_player_color_div_name) ).getPropertyValue("--maze-player-color");
const m_start_color = getComputedStyle( document.getElementById(m_start_color_div_name) ).getPropertyValue("--maze-start-color");
const m_end_color = getComputedStyle( document.getElementById(m_end_color_div_name) ).getPropertyValue("--maze-end-color");

// maze default parameters
const default_speed = 100;
const min_speed = 200;
const min_size = 11;
const max_size = 201;

// maze parameters
var showMazeGen = false;
var stopMazeGen = false;
var isMazeGenerating = false;
var speed = gen_speed.value;
var showSolution = false; // used in pathFinding.js
const difficulty = {
  EASY: 25,
  NORMAL: 45,
  HARD: 69
};
var curDifficulty = difficulty.NORMAL; // tracks the current difficulty
var size = curDifficulty; // size of maze

// set the display elements to default parameters
size_display.innerText = size;
gen_speed.value = default_speed;

// this var is used to track wether or not the game has started aka:
// received input from player
var gameStarted = false;
var isGameOver = false;

// how long a player has to reach the finish
const gameTimer = new Timer({
  start: curDifficulty, // maybe this is good???
  stop: 0,
  onUpdate: (val) => {
    // updates the timer display
    time_display.innerHTML = val.toFixed(2) + "s";
  },
  onComplete: () => {
    isGameOver = true; // lock inputs
    showGameOver(); // show the alert
  }
});
// just set the timer to default value at site start up
time_display.innerHTML = curDifficulty.toFixed(2) + "s";

// toggles different UI for the user
var devMode = false;

// just delta time so everything works nice across refreshrates :D
var delta;

function handleSizeChange(change) {
  if (size + change > min_size && size + change < max_size) {
    size += change;
  } else if (change < 0) {
    size = min_size;
  } else {
    size = max_size;
  }
  size_display.innerText = size;
}

function toggleShowGen() {
  showMazeGen = !showMazeGen;

  genButtonUI();
}


function stopCurrentMazeGen() {
  stopMazeGen = true;
}

function updateSpeed() {
  speed = min_speed - gen_speed.value;
}

function toggleOptions() {
  showMazeGen = false;
  
  genButtonUI();
  
  devMode = !devMode;
  
  if (devMode) {
    param_dev.style.display = "flex";
    param_usr.style.display = "none";
  } else {
    param_dev.style.display = "none";
    param_usr.style.display = "flex";
  }
}

function changeDifficulty(difficult) {
  difficult.toLowerCase();
  
  switch (difficult) {
    case "easy":
      curDifficulty = difficulty.EASY;

      difficulties[0].style.fontSize = "18px";
      difficulties[1].style.fontSize = "13px";
      difficulties[2].style.fontSize = "13px";
      break;
    case "normal":
      curDifficulty = difficulty.NORMAL;

      difficulties[0].style.fontSize = "13px";
      difficulties[1].style.fontSize = "18px";
      difficulties[2].style.fontSize = "13px";
      break;
    case "hard":
      curDifficulty = difficulty.HARD;

      difficulties[0].style.fontSize = "13px";
      difficulties[1].style.fontSize = "13px";
      difficulties[2].style.fontSize = "18px";
      break;
  }
  
  size = curDifficulty;
  restartGame();
}


// AUX //
function genButtonUI() {
  if (showMazeGen) show_gen.innerText = "ON";
  else show_gen.innerText = "OFF";
}

changeDifficulty("normal");