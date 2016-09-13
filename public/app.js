new Fingerprint2({extendedFontList: true}).get((result, components) => {
  document.getElementById("uid").textContent = result;
});

var socket = new WebSocket("ws://localhost:4261/ws");

socket.onmessage = data => {
  document.getElementById("loc").textContent = data.data;
};
