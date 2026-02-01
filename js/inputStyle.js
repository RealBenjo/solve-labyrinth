const range = document.getElementById(gen_speed_name);

function updateRangeFill() {
  const percent =
    (range.value - range.min) /
    (range.max - range.min) * 100;

  range.style.setProperty("--progress", `${percent}%`);
}

range.addEventListener("input", updateRangeFill);
updateRangeFill();
