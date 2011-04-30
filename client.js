var game = function() { 
  
  /**************************************************************************
  * variables 
  **************************************************************************/
  var pieces = [];

  
  /**************************************************************************
  * Board
  **************************************************************************/

  function Board() {
    this.acceleration = { x: 0, y: 0 };
  }
  
  Board.WIDTH = 320;
  Board.HEIGHT = 460;
  
  Board.prototype.draw = function() {
     context.clearRect(0, 0, Board.WIDTH, Board.HEIGHT);
     for (var x = 0.5; x < Board.WIDTH; x += 10) {
         context.moveTo(x, 0);
         context.lineTo(x, Board.HEIGHT);
     }
     for (var y = 0.5; y < Board.HEIGHT; y += 10) {
        context.moveTo(0, y);
        context.lineTo(Board.WIDTH, y);
     }
     context.strokeStyle = "#eee";
     context.stroke();
  }; 

  var board = new Board();
  
  /**************************************************************************
  * BoardPiece 
  **************************************************************************/
  
  function BoardPiece(sessionId) {
    this.sessionId = sessionId;
    this.center = { 
      x: Board.WIDTH / 2,
      y: 0
    };
    this.radius = 32;
    this.acceleration = { x: 0, y: 0 };
    this.color = '#000';
  }
  
  BoardPiece.prototype.draw = function() {
    context.save();
      context.translate(this.center.x, this.center.y);
      context.fillStyle = this.color;
      context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2, false);
      context.closePath();
      context.fill();
    context.restore();
  };
  
  BoardPiece.prototype.updatePosition = function() {
    
    // update center position

    this.center.x += 10 * this.acceleration.x;
    this.center.y -= 10 * this.acceleration.y;

    // stay within canvas boundary
    if (this.center.x < this.radius) {
      this.center.x = this.radius;
    }
    if (this.center.x > Board.WIDTH - this.radius) {
      this.center.x = Board.WIDTH - this.radius;
    }
    if (this.center.y < this.radius) {
      this.center.y = this.radius;
    }
    if (this.center.y > Board.HEIGHT - this.radius) {
      this.center.y = Board.HEIGHT - this.radius;
    }
  };

  /**************************************************************************
  * Device Moved 
  **************************************************************************/

  var deviceMotion = function(event) {
    board.acceleration = event.accelerationIncludingGravity;
  };
  
  setInterval(function() {
    board.draw();
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      p.acceleration = board.acceleration;
      p.updatePosition();
      p.draw();
    }
  }, 25);

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
    pieces.push(new BoardPiece(message));
  }); 
  socket.on('disconnect', function() { 
    console.log('disconnected');
  });

};

window.addEventListener('load', game);

