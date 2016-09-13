var server = require("http").createServer(),
  crypto = require("crypto")
  WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({server: server}),
  express = require("express"),
  app = express();

app.use(express.static(__dirname + "/public"));

wss.on("connection", ws => {
  var loc = crypto.createHmac("sha256", "secret_location")
    .update(ws._socket.remoteAddress)
    .digest("hex");
  ws.send(loc.slice(0,30));
});

server.on('request', app);
server.listen(4261);
