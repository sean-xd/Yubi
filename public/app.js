// Sockets are easier than writing a bunch of http requests.
var socket = new WebSocket(`ws://${location.hostname}:4261/ws`);

// Memoization for DOM element lookups.
var dom = {
  auth: el(".auth")[0],
  authButton: el(".auth-button")[0],
  userInput: el("#user-input"),
  passInput: el("#pass-input"),
  uid: el("#uid"),
  loc: el("#loc")
};

// Browser Fingerprint
new Fingerprint2({extendedFontList: true}).get((result, components) => {
  // Refreshes if this isn't the same id you got last time.
  // For some reason if you restart a browser the first visit gives you a different id than every subsequent visit.
  if(result !== localStorage.last){
    localStorage.last = result;
    return location.reload();
  }
  dom.uid.textContent = result;
  login();
});

// Location and User Fingerprint
socket.onmessage = data => {
  data = JSON.parse(data.data);
  if(data.type === "loc") dom.loc.textContent = data.data;
  if(data.type === "user") loadUser(data.data);
}

function openAuth(){
  if(dom.authButton.textContent === "Account") dom.auth.classList.toggle("left300px");
}

function login(){
  var obj = {uid: localStorage.last};
  if(dom.userInput.value && dom.passInput.value){
    obj.username = dom.userInput.value;
    obj.password = dom.passInput.value;
    dom.userInput.value = "";
    dom.passInput.value = "";
  }
  socket.send(JSON.stringify(obj));
}

function loadUser(data){
  dom.authButton.classList.add("accounted");
  dom.authButton.textContent = data.username;
}

// Utility
function el(name, parent){
  parent = parent || document;
  if(name[0] === ".") return parent.getElementsByClassName(name.substr(1));
  if(name[0] === "#") return parent.getElementById(name.substr(1));
  return parent.getElementsByTagName(name);
}
