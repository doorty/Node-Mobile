var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	io = require('socket.io');
	
// the HTTP server
var server = http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname;
	if (path == '/') {
		path = '/index.html'
	}
	console.log("server " + path);
	fs.readFile(__dirname + path, function(err, data) {
		if (err) {
			res.writeHead(404);
			res.end();
		} else {
			res.writeHead(200, {'Content-Type': contentType(path)});
			res.write(data, 'utf8');
			res.end();
		}
	});
});

function contentType(path) {
	if (path.match('js$')) {
		return 'text/javascript';
	} else if (path.match('.css$')) {
		return 'text/css';
	} else if (path.match('.manifest$')) {
	  return "text/cache-manifest";
	} else {
		return 'text/html';
	}
};

server.listen(3000);


// socket.io
var socket = io.listen(server);
socket.on('connection', function(client) { 

  // tell me what is my id
  client.send(client.sessionId);
  
  // tell everyone else my id
  // client.broadcast(client.sessionId);
  
  client.on('message', function() { 
    
  });
  
  client.on('disconnect', function() { 
    
  });
});