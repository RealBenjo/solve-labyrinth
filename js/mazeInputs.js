const size_display_name = "size_display";
const gen_speed_name = "speed_input";
const show_gen_name = "gen_show_input";

const size_display = document.getElementById(size_display_name);
const gen_speed = document.getElementById(gen_speed_name);
const show_gen = document.getElementById(show_gen_name);

const min_size = 10;

var showGeneration = false;
var speed = gen_speed.value;
var size = 25;

size_display.innerText = size;

function handleSizeChange(change) {
  if (size + change > min_size) {
    size += change;
  }
  size_display.innerText = size;
}

function updateSpeed() {
  speed = gen_speed.value;
}

function toggleShowGen() {
  showGeneration = !showGeneration;
  if (showGeneration) show_gen.innerText = "ON";
  else show_gen.innerText = "OFF";
}

window.onload = function() {
  function test() {
    console.log("test");
  }
  setInterval(test, 1000);
}