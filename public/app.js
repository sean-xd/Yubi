// Browser Fingerprint
if(!localStorage.refreshed){
  localStorage.refreshed = true;
  location.reload();
}

new Fingerprint2({extendedFontList: true}).get((result, components) => {
  document.getElementById("uid").textContent = result;
  console.log(JSON.stringify(components));
});

// Location Fingerprint
var socket = new WebSocket(`ws://${location.hostname}:4261/ws`);
socket.onmessage = data => {
  document.getElementById("loc").textContent = data.data;
}
