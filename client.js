window.addEventListener('load', function() { 
  
  /**************************************************************************
    * init
    **************************************************************************/
   var canvas = document.getElementById('canvas');
   context = canvas.getContext('2d');
   window.addEventListener('devicemotion', deviceMotion, true);
  
  /**************************************************************************
   * socket connection with server. 
   * iOS > 4.2 uses WebSocket, iOS < 4.2 uses long polling
   **************************************************************************/
  var socket = new io.Socket('10.0.1.2', { port: 3000 }); 
  socket.connect();
  socket.on('connect', function() { 
    console.log('connected');
  }); 
  socket.on('message', function(message) { 
    console.log('message: ' + message);
  }); 
  socket.on('disconnect', function() { 
    console.log('disconnected');
  });

});

/**************************************************************************
 * variables 
 **************************************************************************/
var context;

var board = {
  width: 320,
  height: 460
};

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

/**************************************************************************
 * functions 
 **************************************************************************/
var deviceMotion = function(event) {
  var accel = event.accelerationIncludingGravity;
  drawBoard();
  piece.center = computeCenter(piece.center, accel);
  drawPiece(piece);
}

function drawBoard() {
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

function drawPiece(piece) {
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