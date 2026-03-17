function showInstructions() {
  Swal.fire({
    title: "INSTRUCTIONS",
    html: `
      <div style="text-align: left;">
        <p>You are the <b><span style="color:#7700ff;">purple</span> ball</b> and you need to reach the end of the maze,
        which is colored in <span style="color:#ff0095;">hot pink</span>.</p><br>
        
        <b>Controls:</b><br>
        for movement:<br>
        - WASD keys or<br>
        - Arrow keys<br><br>

        <p>You can also change the game's <b>difficulty</b> (easy, normal, hard), 
        show its <b>solution</b>, 
        or <b>generate</b> a new maze.</p>
      </div>
    `,
    width: 700,
    padding: "3em",
    color: m_path_color,
    background: m_wall_color,
    customClass: {
      confirmButton: 'button'
    },
    buttonsStyling: false // prevent default css
  });
}


// for maze gaming
function showGameOver() {
  Swal.fire({
    title: "GAME OVER",
    html: `<p>You ran out of time!</p>`,
    width: 700,
    padding: "3em",
    color: m_path_color,
    background: m_wall_color,
    confirmButtonText: "Try Again",
    customClass: {
      confirmButton: 'button'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      restartGame();
    }
  });
}

function showVictory() {
  Swal.fire({
    title: "You win!",
    html: `<p>Congratulations! You solved the maze!</p>`,
    width: 700,
    padding: "3em",
    color: m_path_color,
    background: m_wall_color,
    confirmButtonText: "Next Maze",
    customClass: {
      confirmButton: 'button'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      restartGame();
    }
  });
}