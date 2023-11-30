const BOARD_WIDTH  = 10;
const BOARD_HEIGHT = 20;
const DISTINCT_PIECES = [
  [[1,1,1,1],
   [0,0,0,0],
   [0,0,0,0],
   [0,0,0,0]],
  [[2,2],
   [2,2]],
  [[0,3,0],
   [3,3,3],
   [0,0,0]],
  [[4,0,0],
   [4,4,4],
   [0,0,0]],
  [[0,0,5],
   [5,5,5],
   [0,0,0]],
  [[6,6,0],
   [0,6,6],
   [0,0,0]],
  [[0,7,7],
   [7,7,0],
   [0,0,0]]
]
const COLOR_MAP = [
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#666600'
]
const board = []
for (var i = 0; i < BOARD_HEIGHT; i++) {
  board.push(new Array(BOARD_WIDTH).fill(0));
}

var targetPiece = JSON.parse(JSON.stringify(DISTINCT_PIECES[6]))
var targetPieceX = 4;
var targetPieceY = 0;
var targetPieceColorId = 3;

function assign_random_target_piece() {
  var idx = Math.floor(Math.random() * 7);
  targetPiece = JSON.parse(JSON.stringify(DISTINCT_PIECES[idx]))
  targetPieceX = 4;
  targetPieceY = 0;
  targetPieceColorId = idx + 1;
  render(board);
}

function collision(board, targetPiece, targetPieceX, targetPieceY) {
  for (var i = 0; i < targetPiece.length; i++) {
    for (var j = 0; j < targetPiece[0].length; j++) {
      if (targetPiece[i][j] != 0) {
        var x = j + targetPieceX;
        var y = i + targetPieceY;
        if (x >= 10 || x < 0 || y >= 20 || y < 0 || board[y][x] != 0) {
          return true;
        }
      }
    }
  }
  return false;
}

function check_game_over() {
  for (var i = 0; i < 10; i++) {
      if (board[0][i] != 0) {
        return true;
      }
  }
  return false;
}

function left() {
  const collision_detected = collision(board, targetPiece, targetPieceX - 1, targetPieceY);
  if (!collision_detected) {
    targetPieceX = targetPieceX - 1;
    render(board);
  }
}

function right() {
  const collision_detected = collision(board, targetPiece, targetPieceX + 1, targetPieceY);
  if (!collision_detected) {
    targetPieceX = targetPieceX + 1;
    render(board);
  }
}

function down() {
  const collision_detected = collision(board, targetPiece, targetPieceX, targetPieceY + 1);
  if (!collision_detected) {
    targetPieceY = targetPieceY + 1;
    render(board);
  }
  return collision_detected;
}

function merge_piece_to_board(board, targetPiece, targetPieceX, targetPieceY, targetPieceColorId) {
    for (var i = 0; i < targetPiece.length; i++) {
      for (var j = 0; j < targetPiece[0].length; j++) {
        if (targetPiece[i][j] != 0) {
          var x = j + targetPieceX;
          var y = i + targetPieceY;
          board[y][x] = targetPieceColorId;
        }
      }
    }
}

function rotate() {
  var targetPieceRotated = JSON.parse(JSON.stringify(targetPiece))
  for (var i = 0; i < targetPiece.length; i++) {
    for (var j = 0; j < targetPiece[0].length; j++) {
      targetPieceRotated[i][j] = targetPiece[j][i];
    }
  }
  targetPieceRotated.reverse();

//  check for collision
  const collision_detected = collision(board, targetPieceRotated, targetPieceX, targetPieceY);
  if (!collision_detected) {
    targetPiece = targetPieceRotated;
    render(board);
  }
}

function render(board) {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 20; j++) {
      if (board[j][i] != 0) {
        var color_id = board[j][i];
        ctx.beginPath()
        ctx.fillStyle = COLOR_MAP[color_id];
        ctx.rect(i * 20, j * 20, 20, 20);
        ctx.fill()
        ctx.closePath()
      }
    }
  }

  for (var i = 0; i < targetPiece.length; i++) {
    for (var j = 0; j < targetPiece[0].length; j++) {
      if (targetPiece[i][j] != 0) {
        var x = j + targetPieceX;
        var y = i + targetPieceY;
        if (x < 10 && x >= 0 && y < 20 && y >= 0) {
          ctx.beginPath()
          ctx.fillStyle = COLOR_MAP[targetPieceColorId];
          ctx.rect(x * 20, y * 20, 20, 20);
          ctx.fill()
          ctx.closePath()
        }
      }
    }
  }
}

setInterval(function() {
  var collision_detected = down();
  if (collision_detected) {
    hard_set();
  }
}, 1000);

function hard_set() {
  while (!down()) {}
  merge_piece_to_board(board, targetPiece, targetPieceX, targetPieceY, targetPieceColorId);
  check_complete_lines(board);
  const game_over = check_game_over();
  if (game_over) {
    alert('Game Over');
  }
  assign_random_target_piece();
}

function check_complete_lines(board) {
  const completedIndices = [];
  for (var i = 0; i < 20; i++) {
    var complete = true;
    for (var j = 0; j < 10; j++) {
      if (board[i][j] == 0) {
        complete = false;
        break;
      }
    }
    if (complete) {
      completedIndices.push(i);
    }
  }

  for (var i = 0; i < completedIndices.length; i++) {
    board.splice(completedIndices[i], 1);
    board.unshift(new Array(BOARD_WIDTH).fill(0))
  }
}

console.log(collision(board, targetPiece, targetPieceX, targetPieceY));
check_complete_lines(board);
render(board);

document.addEventListener("keydown", logKey);
function logKey(e) {
   console.log(e.key);
   if (e == null) return;
   switch (e.key) {
     case 'a':
     case 'ArrowLeft':
       left();
       break;
     case 'w':
     case 'ArrowUp':
       rotate();
       break;
     case 'd':
     case 'ArrowRight':
       right();
       break;
     case 's':
     case 'ArrowDown':
       down();
       break;
     case ' ':
       hard_set();
     default:
       // do something if none of the cases match
       break;
   }
}
