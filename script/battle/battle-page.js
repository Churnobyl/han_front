import { getRoomDetailApi, checkAnonymous, socket } from "/script/api.js";

checkAnonymous();

// 버튼 이벤트리스너 모음
document.getElementById("quit-btn").addEventListener("click", function () {
  window.location.replace("/html/battle/lobby.html");
});

/* 웹소켓 관련 */
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get("room");
const access = localStorage.getItem("access");

socket.onopen = function (e) {
  socket.send(
    JSON.stringify({
      type: "join_room",
      room: roomName,
    })
  );
  socket.send(
    JSON.stringify({
      type: "chat_message",
      message: "접속했습니다.",
    })
  );
};

socket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  document.getElementById("chat-log").value += data.message + "\n";
};

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
const token = localStorage.getItem("access");

const nowPage = window.location.pathname;
const pageSplit = nowPage.split("/");
const pageName = pageSplit[pageSplit.length - 1].split(".")[0];

const payload = token.split(".")[1];
const decodedPayload = JSON.parse(atob(payload));
const userId = decodedPayload["user_id"];

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
  socket.send(
    JSON.stringify({
      type: "chat_message",
      message: message,
    })
  );
  messageInputDom.value = "";
}

/* 웹소켓 관련 end */

// 방 정보 가져오기
getRoomDetailApi(roomName).then(({ response, responseJson }) => {
  if (response.status === 200) {
    // 방 정보
    document.getElementById("roomId").innerText = `[ ${responseJson["id"]} ]`;
    document.getElementById("roomName").innerText = responseJson["btl_title"];
    document.getElementById("roomHost").innerText = responseJson["host_user"];
    document.getElementById("roomCategory").innerText =
      responseJson["btl_category"];

    // 유저 정보
    const onUsers = responseJson["participant_list"];
    const maxUsers = responseJson["max_users"];
    for (let i = maxUsers + 1; i <= 4; i++) {
      let userBox = document.getElementById(`user-box-${i}`);
      userBox.style = "visibility: hidden;";
    }
    let i = 1;
    let hostUser;
    onUsers.forEach((user) => {
      let userBox = document.getElementById(`user-box-${i}`);
      let img;
      if (user["participant"]["image"]) {
        img = user["participant"]["image"];
      } else {
        const randomPick = Math.floor(Math.random() * 5 + 1);
        img = `/img/user-profile/${randomPick}.png`;
      }
      userBox.querySelector(".profile-container img").src = img;
      const isHost = user["is_host"];
      if (isHost) {
        document.querySelector(".achievement").src = "/img/fake/crown.png";
        hostUser = user["participant"]["id"];
      }
      const nickname = user["participant"]["username"];
      const username = document.getElementById("username");
      username.innerText = nickname;
      username.addEventListener("click", function () {
        window.location.replace(
          `/html/mypage.html?id=${user["participant"]["id"]}`
        );
      });
      i++;
    });
    if (userId == hostUser) {
      document.getElementById("ready").style = "display: none;";
    } else {
      document.getElementById("start").style = "display: none;";
    }
  } else {
    alert("웹소켓 연결에 실패했습니다.");
  }
});
