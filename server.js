var server = require("http").createServer(),
  crypto = require("crypto")
  fs = require("fs"),
  WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({server: server}),
  express = require("express"),
  app = express(),
  users = require(__dirname + "/db/users.json");

app.use(express.static(__dirname + "/public"));

wss.on("connection", ws => {
  ws.send(JSON.stringify({type: "loc", data: hmac(ws._socket.remoteAddress)}));
  ws.on("message", data => {
    data = JSON.parse(data);
    var user = users.find(e => e.browsers.indexOf(data.uid) > -1);
    if(user) return sendUser(ws, user);
    if(data.username) user = users.find(e => e.username === data.username);
    if(!user && data.username && data.password){
      user = createUser(data.username, data.password, data.uid);
    }
    if(user && user.hash === hmac(data.password)){
      if(user.browsers.indexOf(data.uid) === -1){
        user.browsers.push(data.uid);
        saveUsers();
      }
      return sendUser(ws, user);
    }
    if(!user) ws.send(JSON.stringify({type: "user", data: false}));
  });
});

server.on('request', app);
server.listen(4261);

function saveUsers(){
  fs.writeFile(__dirname + "/db/users.json", JSON.stringify(users));
}

function sendUser(ws, user){
  console.log(user);
  ws.send(JSON.stringify({type: "user", data: {username: user.username, browsers: user.browsers}}));
}

function createUser(username, password, uid){
  var user = {username, hash: hmac(password), browsers: [uid]};
  users.push(user);
  saveUsers();
  return user;
}

function hmac(data){
  if(!data) return "";
  return crypto.createHmac("sha256", "lazy_secret").update(data).digest("hex").slice(0, 30);
}
