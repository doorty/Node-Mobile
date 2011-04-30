var game = function() { 
  
  /**************************************************************************
  * variables 
  **************************************************************************/
  var pieces = [];

  var board = {
    WIDTH: 320,
    HEIGHT: 460
  };
  
  var BoardPiece = function(sessionId) {
    this.sessionId = sessionId;
    this.center = { 
      x: board.WIDTH / 2,
      y: 0
    };
    this.radius = 32;
    this.color = '#000';
  };
  
  var piece = new BoardPiece(3);

  /*
  var piece = {
  	center: {
  		x: board.WIDTH / 2,
  		y: 0,
  		xShift: 0,
  		yShift: 0
  	},
  	radius: 32,
  	color: '#000'
  };
  */
  
  /**************************************************************************
  * functions 
  **************************************************************************/
     
  
   
  var deviceMotion = function(event) {
    var accel = event.accelerationIncludingGravity;
    drawBoard();
    piece.center = computeCenter(piece.center, accel);
    drawPiece(piece);
  };

  var drawBoard = function() {
     context.clearRect(0, 0, board.WIDTH, board.HEIGHT);
     for (var x = 0.5; x < board.WIDTH; x += 10) {
         context.moveTo(x, 0);
         context.lineTo(x, board.HEIGHT);
     }
     for (var y = 0.5; y < board.HEIGHT; y += 10) {
        context.moveTo(0, y);
        context.lineTo(board.WIDTH, y);
     }
     context.strokeStyle = "#eee";
     context.stroke();
  };

  var drawPiece = function(p) {
     context.fillStyle = p.color;
     context.beginPath();
     context.arc(p.center.x, p.center.y, p.radius, 0, Math.PI * 2, false);
     context.closePath();
     context.fill();
  };

  var computeCenter = function(oldCenter, acceleration) {
     var newCenter = {};

     newCenter.x = oldCenter.x + 2 * acceleration.x;
     newCenter.y = oldCenter.y - 2 * acceleration.y;
     
     // stay within canvas boundary
     if (newCenter.x < piece.radius) {
        newCenter.x = piece.radius;
     }
     if (newCenter.x > board.WIDTH - piece.radius) {
        newCenter.x = board.HEIGHT - piece.radius;
     }
     if (newCenter.y < piece.radius) {
        newCenter.y = piece.radius;
     }
     if (newCenter.y > board.HEIGHT - piece.radius) {
        newCenter.y = board.HEIGHT - piece.radius;
     }
     return newCenter;
  };
  
  /**************************************************************************
  * init
  **************************************************************************/
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
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

};

window.addEventListener('load', game);

