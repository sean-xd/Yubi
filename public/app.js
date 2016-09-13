// Sockets are easier than writing a bunch of http requests.
var socket = new WebSocket(`ws://${location.hostname}:4261/ws`);

// Memoization for DOM element lookups.
var dom = {
  auth: el(".auth")[0],
  authButton: el(".auth-button")[0],
  userInput: el("#user-input"),
  passInput: el("#pass-input"),
  uid: el("#uid"),
  loc: el("#loc"),
  sidebar: el("aside")[0]
};

// Browser Fingerprint
socket.onopen = () => {
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
};

// Location and User Fingerprint
socket.onmessage = data => {
  data = JSON.parse(data.data);
  if(data.type === "loc") dom.loc.textContent = data.data;
  if(data.type === "user") loadUser(data.data);
}

// Account Functionality
function openAuth(){
  if(dom.authButton.textContent === "Account") dom.auth.classList.toggle("left300px");
  else {
    dom.sidebar.classList.toggle("left240px");
    dom.auth.classList.toggle("left140px");
    dom.authButton.classList.toggle("w240px");
  }
}

function login(){
  var obj = {uid: localStorage.last};
  if(dom.userInput.value && dom.passInput.value){
    obj.username = dom.userInput.value;
    obj.password = dom.passInput.value;
    dom.userInput.value = "";
    dom.passInput.value = "";
    dom.auth.classList.remove("left300px");
  }
  socket.send(JSON.stringify(obj));
}

var browsers = [];
function loadUser(data){
  if(!data) return;
  dom.authButton.classList.add("accounted");
  dom.authButton.textContent = data.username;
  data.browsers.forEach(addBrowser);
}

// Sidebar
function addBrowser(uid){
  var browser = document.createElement("div"),
    browserId = document.createElement("div"),
    browserDelete = document.createElement("i");
  browser.className = "browser";
  browserId.className = "browser-id";
  browserId.textContent = uid;
  browserId.addEventListener("click", e => openBrowser(e.target));
  browserDelete.className = "material-icons browser-delete";
  browserDelete.textContent = "close";
  browserDelete.addEventListener("click", e => deleteBrowser(e.target.parentNode, uid));
  browser.appendChild(browserId);
  browser.appendChild(browserDelete);
  dom.sidebar.appendChild(browser);
}

function deleteBrowser(parent, uid){
  dom.sidebar.removeChild(parent);
  socket.send(JSON.stringify({uid: uid, del: true}));
  if(localStorage.last === uid) location.reload();
}

function openBrowser(target){
  el(".browser-delete", target.parentNode)[0].classList.toggle("left40px");
  target.classList.toggle("left40px");
}

// Utility
function el(name, parent){
  parent = parent || document;
  if(name[0] === ".") return parent.getElementsByClassName(name.substr(1));
  if(name[0] === "#") return parent.getElementById(name.substr(1));
  return parent.getElementsByTagName(name);
}
