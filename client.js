var board = {
  width: 320,
  height: 460
}

var piece = {
	center: {
		x: board.width / 2,
		y: 0,
		xShift: 0,
		yShift: 0
	},
	radius: 32,
	color: '#000'
};

$(document).ready(function() {
  var board = document.getElementById('board');
  var context = board.getContext('2d');
  window.addEventListener('devicemotion', function(event) {
    var accel = event.accelerationIncludingGravity;
    piece.center = computeCenter(piece.center, accel);
    drawBoard(context);
    drawPiece(context, piece);
  }, true);
});

function drawBoard(context) {
   context.clearRect(0, 0, board.width, board.height);
   for (var x = 0.5; x < board.width; x += 10) {
       context.moveTo(x, 0);
       context.lineTo(x, board.height);
   }
   for (var y = 0.5; y < board.height; y += 10) {
      context.moveTo(0, y);
      context.lineTo(board.width, y);
   }
   context.strokeStyle = "#eee";
   context.stroke();
}

function drawPiece(context, piece) {
   context.fillStyle = piece.color;
   context.beginPath();
   context.arc(piece.center.x, piece.center.y, piece.radius, 0, Math.PI * 2, false);
   context.closePath();
   context.fill();
}

function computeCenter (oldCenter, acceleration) {
   newCenter = {};
   newCenter.xShift = oldCenter.xShift * 0.8 + acceleration.x * 2.0;
   newCenter.yShift = oldCenter.yShift * 0.8 + acceleration.y * 2.0;
   newCenter.x = oldCenter.x + oldCenter.xShift;
   // use *minus* to compute the center's new y
   newCenter.y = oldCenter.y - oldCenter.yShift;
   // do not go outside the boundaries of the canvas
   if (newCenter.x < piece.radius) {
      newCenter.x = piece.radius;
   }
   if (newCenter.x > board.width - piece.radius) {
      newCenter.x = board.width - piece.radius;
   }
   if (newCenter.y < piece.radius) {
      newCenter.y = piece.radius;
   }
   if (newCenter.y > board.height - piece.radius) {
      newCenter.y = board.height - piece.radius;
   }
   return newCenter;
}