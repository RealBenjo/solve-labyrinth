// names of the needed HTML elements
const m_path_color_div_name = "m_path_color";
const m_wall_color_div_name = "m_wall_color";
const size_display_name = "size_display";
const gen_speed_name = "speed_input";
const show_gen_name = "gen_show_input";

// actual HTML elements
const size_display = document.getElementById(size_display_name);
const gen_speed = document.getElementById(gen_speed_name);
const show_gen = document.getElementById(show_gen_name);



// colors from css
const m_path_color = getComputedStyle( document.getElementById(m_path_color_div_name) ).getPropertyValue("--maze-path-color");
const m_wall_color = getComputedStyle( document.getElementById(m_wall_color_div_name) ).getPropertyValue("--maze-wall-color");

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

function stopCurrentMazeGen() {
  stopMazeGen = true;
}

function updateSpeed() {
  speed = min_speed - gen_speed.value;
}

function toggleShowGen() {
  showMazeGen = !showMazeGen;
  if (showMazeGen) show_gen.innerText = "ON";
  else show_gen.innerText = "OFF";
}

window.onload = function() {
  function test() {
    //console.log("test");
  }
  setInterval(test, 1000);
}