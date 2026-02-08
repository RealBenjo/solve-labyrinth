// names of the needed HTML elements
const m_path_color_div_name = "m_path_color";
const m_wall_color_div_name = "m_wall_color";
const m_solution_color_div_name = "m_solution_color";
const m_player_color_div_name = "m_player_color";

const size_display_name = "size_display";
const gen_speed_name = "speed_input";
const show_gen_name = "gen_show_input";
const maze_canvas_name = "maze_canvas";
const path_canvas_name = "path_canvas";
const player_canvas_name = "player_canvas";

// actual HTML elements
const size_display = document.getElementById(size_display_name);
const gen_speed = document.getElementById(gen_speed_name);
const show_gen = document.getElementById(show_gen_name);
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

// maze default parameters
const default_speed = 100;
const min_speed = 200;
const min_size = 11;
const max_size = 501;

// maze parameters
var showMazeGen = false;
var stopMazeGen = false;
var isMazeGenerating = false;
var speed = gen_speed.value;
var size = 25;
var showSolution = false; // used in pathFinding.js

// set the display elements to default parameters
size_display.innerText = size;
gen_speed.value = default_speed;

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
  if (showMazeGen) show_gen.innerText = "ON";
  else show_gen.innerText = "OFF";
}

function stopCurrentMazeGen() {
  stopMazeGen = true;
}

function updateSpeed() {
  speed = min_speed - gen_speed.value;
}
