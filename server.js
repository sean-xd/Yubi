var server = require("http").createServer(),
  crypto = require("crypto")
  WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({server: server}),
  express = require("express"),
  app = express();

app.use(express.static(__dirname + "/public"));

wss.on("connection", ws => {
  ws.send(hmac(ws._socket.remoteAddress));
});

server.on('request', app);
server.listen(4261);

function hmac(data){
  return crypto.createHmac("sha256", "lazy_secret").update(data).digest("hex").slice(0, 30);
}
