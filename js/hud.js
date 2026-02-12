function showInstructions() {
  Swal.fire({
    title: "INSTRUCTIONS",
    html: `
      <p>You are the <b><span style="color:#2e6dff;">blue</span> ball</b> and you need to reach the end of the maze,
      which is colored in <span style="color:red;">red</span>.</p><br>
      
      <b>Controls:</b><br>
      - WASD keys or<br>
      - Arrow keys<br><br>

      <p>You can also change the maze <b>size</b>,<br>
      show it's <b>solution</b>,<br>
      and you can also see how it's made in real-time by turning on the <b>"maze visualization toggle"</b><br>
      and you can change the <b>visualization speed</b> with it's slider</p>
    `,
    width: 700,
    padding: "3em",
    color: m_path_color,
    background: m_wall_color,
    customClass: {
      confirmButton: 'button'
    },
    buttonsStyling: false // prevent default styling
  });
}