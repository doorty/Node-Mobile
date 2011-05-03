var game = function() { 
  
  /**************************************************************************
  * DOM
  **************************************************************************/
  
  var canvas = document.getElementById('canvas');
  canvas.width = document.width;
  canvas.height = document.height;
  
  var context = canvas.getContext('2d');

  var pieces = [];
  
  var my_piece;
  
  /**************************************************************************
  * Notification
  **************************************************************************/
  var Notification = function() {
    this.color = '#666'; // '#00FF00' lime green
  }

  Notification.prototype.draw = function(message) {
    context.font = "bold 1em sans-serif";
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillStyle = this.color;
    context.fillText(message, 5, canvas.height);
  }
  
  var notification = new Notification();
  
  /**************************************************************************
  * Frames per second
  **************************************************************************/
  var Fps = function() {
    this.lastTime = new Date().getTime();
    this.actualFps = 0;
    this.color = '#000'; // '#00FF00' lime green
  }
  
  Fps.FPS = 60;  // 30 frames a second, theoretical 
  Fps.MILLISEC_PER_FRAME = Math.round(1000 / Fps.FPS);
  
  Fps.prototype.update = function() {
    var currentTime = new Date().getTime();
    var timeDiff = currentTime - this.lastTime; // time in miliseconds
    this.actualFps = Math.round(1000 / timeDiff);
    this.lastTime = currentTime;
  }
  
  Fps.prototype.draw = function() {
    context.font = "bold 1em sans-serif";
    context.textAlign = 'right';
    context.textBaseline = 'bottom';
    context.fillStyle = this.color;
    context.fillText(this.actualFps + ' FPS', canvas.width - 5, canvas.height);
  }
  
  var fps = new Fps();
  
  /**************************************************************************
  * Board
  **************************************************************************/

  var Board = function() {

  }
  
  Board.WIDTH = canvas.width;
  Board.HEIGHT = canvas.height;
  
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
  
  var BoardPiece = function(sessionId) {
    this.sessionId = sessionId;
    this.center = { 
      x: Board.WIDTH / 2,
      y: 0
    };
    this.radius = 32;
    this.acceleration = { x: 0, y: 0 };
    this.color = '#000';
  };
  
  BoardPiece.prototype.draw = function() {
    context.save();
      context.fillStyle = this.color;
      context.beginPath();
        context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, false);
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
      my_piece.acceleration = event.accelerationIncludingGravity;
  };

  /**************************************************************************
   * socket connection with server. 
   * iOS > 4.2 uses WebSocket, iOS < 4.2 uses long polling
   **************************************************************************/
  var socket = new io.Socket('10.0.1.2', { port: 3000 }); 
  
  socket.connect();
  
  socket.on('connect', function() { 
    console.log('connected at ' + new Date());
  }); 
  
  socket.on('message', function(json) { 
    console.log('json: ' + json);
    
    if (my_piece === null || my_piece === undefined) {
      my_piece = new BoardPiece(json.sessionId);
      window.addEventListener('devicemotion', deviceMotion, true);
    }
    else {
      var piece = JSON.parse(json); // convert json to object
      piece.__proto__ = BoardPiece.prototype; // provide access to BoardPiece's draw()
      pieces.push(piece);
      //notification.draw('Piece ' + piece.sessionId + ' updated their location to x, y = ' + piece.center.x + ', ' +  piece.center.y);
    }

  }); 
  
  socket.on('disconnect', function() { 
    console.log('disconnected');
  });
  
  /**************************************************************************
   * Refresh rate 
   **************************************************************************/
  
  var frame =  function() {
    board.draw();
    if (my_piece) {
      my_piece.updatePosition();
      my_piece.draw();
      socket.send(JSON.stringify(my_piece)); // convert object to json
    }
    var i = pieces.length;
    while (i--) {
      var p = pieces.pop();
      p.draw();
    }
    fps.update();
    fps.draw();
   };
  
  setInterval(frame, Fps.MILLISEC_PER_FRAME); 

};

window.addEventListener('load', game);

