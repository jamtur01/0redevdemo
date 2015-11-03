var fs = require('fs');
var express = require('express'),
    app = express(),
    redis = require('redis'),
    server = require('http').createServer(app),
    port = process.env.DB_1_PORT_6379_TCP_PORT,
    host = process.env.DB_PORT_6379_TCP_ADDR;


var logFile = fs.createWriteStream('/var/log/nodeapp/nodeapp.log', {flags: 'a'});
var client = redis.createClient(port, host);

app.configure(function() {
  app.use(express.logger({stream: logFile}));
  app.use(express.cookieParser('keyboard-cat'));
});

app.get('/', function(req, res) {
  res.json({
    status: "ok"
  });
});

app.get('/get/:key', function(req, response) {
        client.get(req.params.key, function (error, val) {
		if (error !== null) console.log("error: " + error);
		else {
			response.send("<html><h1>The value for this key is " + val + "</h1></html>");
		}
	});
});

app.get('/set/:key/:value', function(req, response) {
        client.set(req.params.key, req.params.value, function (error, result) {
		if (error !== null) console.log("error: " + error);
		else {
			response.send("<html><h1>The value for '"+req.params.key+"' is set to: " + req.params.value + "</h1></html>");
		}
	});
});

var port = process.env.HTTP_PORT || 3000;
server.listen(port);
console.log('Listening on port ' + port);
