import { getRoomDetailApi, checkAnonymous, socket } from "/script/api.js";
import { BACK_WEBSOCKET_URL, BACK_BASE_URL } from "/script/conf.js";

checkAnonymous();

// 버튼 이벤트리스너 모음
document.getElementById("quit-btn").addEventListener("click", roomQuit);
document.getElementById("start").addEventListener("click", gameStart);
document.getElementById("invite").addEventListener("click", inviteModal);
document.getElementById("invite-button").addEventListener("click", inviteBtn);
let modal = document.querySelector(".modal");

/* 웹소켓 관련 */
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get("room");
const access = localStorage.getItem("access");
let quiz;

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
  if (data.method === "chat_message") {
    var chatLog = document.getElementById("chat-log");
    chatLog.value += data.message + "\n";
    chatLog.scrollTop = chatLog.scrollHeight;
  } else if (data.method === "send_quiz") {
    quiz = data.quiz;
    showQuiz();
  }

  if (data.method === "next_quiz") {
    quiz_count++;
    setTimeout(showQuiz, 3000);
  } else if (data.method === "end_quiz") {
    resultQuiz();
  }

  if (data.method === "room_check") {
    showUser(data.message);
  }

};

const payload = access.split(".")[1];
const decodedPayload = JSON.parse(atob(payload));
const userId = decodedPayload["user_id"];

const startBtn = document.getElementById("start");
let start_game = false;
let quiz_answer;
let quiz_count = 0;

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
  correctQuiz();
  messageInputDom.value = "";
}

function gameStart() {
  start_game = true;
  startBtn.style = "display: none;";
  socket.send(
    JSON.stringify({
      type: "start_game",
      message: "start game",
    })
  );
}

function showQuiz() {
  const nowQuiz = quiz[quiz_count]["dict_word"];
  quiz_answer = nowQuiz["word"];
  for (let i = 1; i <= nowQuiz["examples"].length; i++) {
    const explain = document.getElementById("explains-text");
    explain.innerText = `${quiz[quiz_count]["content"]}`;
    const example = document.getElementById(`examples-${i}`);
    example.innerText = `${i}: ${nowQuiz["examples"][i - 1]}`;
  }
  const quizAnswer = document.getElementById("quizAnswer");
  const handleHint = document.getElementById("quizHint");
  quizAnswer.innerHTML = "";
  handleHint.innerHTML = "";

  function showHint() {
    handleHint.innerHTML = `힌트: <span id="hint">${nowQuiz["hint"]}</span>`;
  }
  // 5초 후에 힌트 공개
  setTimeout(showHint, 5000);

  // 25초 후에 정답자 없으면 다음 문제로
}

function correctQuiz() {
  const userInput = document.getElementById("chat-message-input").value;
  if (userInput === quiz_answer) {
    const answer = document.getElementById("quizAnswer");
    answer.innerHTML = `정답 : <span id="answer">${quiz_answer}</span>`;
    if (quiz.length === quiz_count + 1) {
      socket.send(
        JSON.stringify({
          type: "correct_answer",
          message: "퀴즈 끝",
          end: true,
        })
      );
      start_game = true;
      startBtn.style = "display: inline-block;";
    } else {
      socket.send(
        JSON.stringify({
          type: "correct_answer",
          message: "정답",
        })
      );
    }
  }
}

function resultQuiz() {
  socket.send(
    JSON.stringify({
      type: "result",
      message: "결과",
    })
  );
}

function roomQuit() {
  socket.send(
    JSON.stringify({
      type: "leave_room",
      message: "나갔습니다.",
    })
  )

  window.location.replace("/html/battle/lobby.html");
}

/* 웹소켓 관련 end */

// 초대 관련
function inviteModal() {
  modal.classList.toggle("show");
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.toggle("show");
  }
});

async function inviteBtn() {
  const inviteUserId = document.getElementById("invite-user-id").value;
  socket.send(
    JSON.stringify({
      type: "invitation",
      receiver: inviteUserId,
    })
  );
  alert("초대를 보냈습니다.");
}

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
        img = `${BACK_BASE_URL}${user["participant"]["image"]}`;
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
      const username = document.getElementById(`username-${i}`);
      username.innerText = nickname;
      username.addEventListener("click", function () {
        window.location.replace(
          `/html/mypage.html?id=${user["participant"]["id"]}`
        );
      });
      i++;
    });
    if (userId != hostUser) {
      startBtn.style = "display: none;";
    }
  } else {
    alert("웹소켓 연결에 실패했습니다.");
  }
});

function showUser(users) {
  // 방 참가자 초기화
  for (let j=1; j<=4; j++) {
    const userName = document.getElementById(`username-${j}`)
    const userBox = document.getElementById(`user-box-${j}`)
    userName.innerText = ""
    userBox.querySelector(".profile-container img").src = ""
    document.getElementById(`userimage-${j}`).src = "";
  }


  // 방 참가자 보여주기
  for (let j=1; j<=users.length; j++) {
    const joinUser = users[j-1]["participant"]
    
    
    
    const userName = document.getElementById(`username-${j}`)
    const userBox = document.getElementById(`user-box-${j}`)
    userName.innerText = joinUser["username"]
    if (joinUser["image"] !== null) {
      userBox.querySelector(".profile-container img").src = `${BACK_BASE_URL}${joinUser["image"]}`
    } else {
      const randomPick = Math.floor(Math.random() * 5 + 1);
      userBox.querySelector(".profile-container img").src = `/img/user-profile/${randomPick}.png`;
    }
    if (users[j-1]["is_host"]) {
      document.getElementById(`userimage-${j}`).src = "/img/fake/crown.png";
    } else {
      if (joinUser["wear_achievement"] !== -1) {
        joinUser["achieve"].forEach(achieve => {
          if (achieve["id"]===joinUser["wear_achievement"]) {
            console.log(achieve)
            document.getElementById(`userimage-${j}`).src = `/${achieve["image_url"]}`
          }
        })
      }
    }
  }
}

