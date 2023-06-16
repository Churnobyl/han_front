import { getRoomDetailApi } from "/script/api.js";
import { BACK_WEBSOCKET_URL } from "/script/conf.js";

/* 웹소켓 관련 */
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get("room");
const access = localStorage.getItem("access");
const base64Url = access.split(".")[1];
const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
const jsonPayloadString = decodeURIComponent(
  atob(base64)
    .split("")
    .map(function (c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    })
    .join("")
);
const jsonPayload = JSON.parse(jsonPayloadString);
const getUsername = jsonPayload.username;
const roomData = {
  host: getUsername,
  roomName: roomName,
};
//  + "/?token=" + access

const sessionId = sessionStorage.getItem("session_data");
const token = localStorage.getItem("access");

const chatSocket = new WebSocket(
  "ws://" +
    BACK_WEBSOCKET_URL +
    "/ws/battle/" +
    roomName +
    "/?sessionKey=" +
    sessionId +
    "&token=" +
    token
);

chatSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  document.getElementById("chat-log").value += data.message + "\n";
};

chatSocket.onopen = () => {
  chatSocket.send(
    JSON.stringify({
      roomData: roomData,
      message: "접속했습니다.",
    })
  );
};

chatSocket.onclose = function (e) {
  console.error("Chat socket closed unexpectedly");
};

document.getElementById("chat-message-input").focus();
document.getElementById("chat-message-input").onkeyup = function (e) {
  if (e.key === 13 || e.key === "Enter") {
    sendMessage();
  }
};
document.getElementById("chat-message-submit").onclick = function (e) {
  sendMessage();
};

function sendMessage() {
  const messageInputDom = document.getElementById("chat-message-input");
  const message = messageInputDom.value;
  chatSocket.send(
    JSON.stringify({
      roomData: roomData,
      message: message,
    })
  );
  messageInputDom.value = "";
}

/* 웹소켓 관련 end */

// 방 정보 가져오기
getRoomDetailApi(roomName).then(({ response, responseJson }) => {
  if (response.status === 200) {
    console.log(responseJson);
    document.getElementById("roomId").innerText = responseJson["id"];
    document.getElementById("roomName").innerText = responseJson["btl_title"];
    document.getElementById("roomHost").innerText = responseJson["host_user"];
    document.getElementById("roomCategory").innerText =
      responseJson["btl_category"];
  } else {
    alert("웹소켓 연결에 실패했습니다.");
  }
});
