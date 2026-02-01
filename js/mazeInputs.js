const size_display_name = "size_display";
const gen_speed_name = "speed_input";
const show_gen_name = "gen_show_input";

const size_display = document.getElementById(size_display_name);
const gen_speed = document.getElementById(gen_speed_name);
const show_gen = document.getElementById(show_gen_name);

const default_speed = 100;
const min_speed = 200;
const min_size = 11;
const max_size = 5001;

var showGeneration = false;
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

function updateSpeed() {
  speed = min_speed - gen_speed.value;
}

function toggleShowGen() {
  showGeneration = !showGeneration;
  if (showGeneration) show_gen.innerText = "ON";
  else show_gen.innerText = "OFF";
}

window.onload = function() {
  function test() {
    //console.log("test");
  }
  setInterval(test, 1000);
}