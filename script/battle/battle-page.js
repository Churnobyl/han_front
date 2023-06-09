import { BACK_WEBSOCKET_URL } from "/script/conf.js";

const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get("room");

const chatSocket = new WebSocket(
  "ws://" + BACK_WEBSOCKET_URL + "/ws/battle/" + roomName + "/"
);

chatSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  document.getElementById("chat-log").value += data.message + "\n";
};

chatSocket.onclose = function (e) {
  console.error("Chat socket closed unexpectedly");
};

document.getElementById("chat-message-input").focus();
document.getElementById("chat-message-input").onkeyup = function (e) {
  if (e.key === 13 || e.key === "Enter") {
    document.getElementById("chat-message-submit").click();
  }
};

document.getElementById("chat-message-submit").onclick = function (e) {
  const messageInputDom = document.getElementById("chat-message-input");
  const message = messageInputDom.value;
  chatSocket.send(
    JSON.stringify({
      message: message,
    })
  );
};
messageInputDom.value = "";
