import { getRoomDetailApi, checkAnonymous, socket } from "/script/api.js";
import { BACK_WEBSOCKET_URL, BACK_BASE_URL } from "/script/conf.js";

/* 게임 정보 전역 변수 초기화 */
const gameState = {
  roomName: null, // 쿼리스트링 room = ? 방 정보 얻을 때 사용
  access: null, // 엑세스 토큰
  userId: null, // 엑세스 토큰 안에서 얻은 userId 정보
  hostUser: null, // 이 방에서 방장
  startGame: false, // 프론트 게임 진행 여부
  quiz: null, // 게임 시작 시 받는 전체 퀴즈 정보
  quiz_answer: null, // 퀴즈 정답
  nowQuiz: null, // 현재 퀴즈 정보
  nowHintIndexes: null, // 제공된 힌트 인덱스들
  quizCount: null, // 현재 퀴즈 넘버
  countdown: null, // 힌트 카운트다운
  showHintTimeout: null, // 힌트 대기 카운트다운
  lastChats: {},
};

/* 선택자 정보 초기화 */
const selector = {
  handleHint: null, // 힌트 보여주는 부분
  modal: null, // 모달창
  startBtn: null, // 시작 버튼
};

/* 시스템 초기화 */
const init = async () => {
  checkAnonymous(); // 로그인 하지 않았을 경우 메인으로 돌려보냄

  gameState.roomName = new URLSearchParams(window.location.search).get("room");
  gameState.access = localStorage.getItem("access");
  gameState.userId = getUser(gameState.access);

  try {
    const roomInfo = await getRoomDetailApi(gameState.roomName); // 방 정보 fetch
    await handleRoomInfo(roomInfo); // 방 정보 필요한 부분에 핸들링
    addEventListeners();
    handleChat();
  } catch (err) {
    console.error("방 정보를 불러오는데 실패했습니다: ", err);
  }
};

/* 엑세스 토큰에서 user id 뽑아내는 함수 */
function getUser(accessToken) {
  const payload = accessToken.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload["user_id"];
}

/* 받아온 정보를 각 함수에 뿌려주는 핸들링 함수 */
function handleRoomInfo({ response, responseJson }) {
  return new Promise((resolve, reject) => {
    if (response.status === 200) {
      // 각 함수 실행
      injectRoomInfo(responseJson);
      injectUsers(responseJson);
      resolve();
    } else {
      reject("서버에 문제가 있습니다.");
    }
  });
}

/* 모든 정보를 불러온 후 이벤트리스너를 붙이는 함수 */
function addEventListeners() {
  selector.modal = document.querySelector(".modal");
  selector.startBtn = document.getElementById("start");
  document.getElementById("quit").addEventListener("click", roomQuit);
  document.getElementById("start").addEventListener("click", gameStart);
  document.getElementById("invite").addEventListener("click", inviteModal);
  document.getElementById("invite-button").addEventListener("click", inviteBtn);

  // 엔터 입력했을 경우
  document
    .getElementById("invite-user-id")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === 13) {
        inviteBtn();
      }
    });

  selector.modal.addEventListener("click", (event) => {
    if (event.target === selector.modal) {
      selector.modal.classList.toggle("show");
    }
  });
}

/* 방 정보 실행 */
function injectRoomInfo(data) {
  // 방 아이디
  document.getElementById("roomId").innerText = `[ ${data["id"]} ]`;
  // 방 제목
  document.getElementById("roomName").innerText = data["btl_title"];
  // 방장
  document.getElementById("roomHost").innerText = data["host_user"];
  // 방 카테고리
  document.getElementById("roomCategory").innerText = data["btl_category"];
}

/* 유저 정보 추가하는 함수 */
function injectUsers(data) {
  initUsers();

  const onUsers = data["participant_list"];
  const maxUsers = data["max_users"];

  hideUnusedUserBoxes(maxUsers);

  onUsers.forEach((user, i) => {
    updateUserBox(user, i + 1);
    // 유저가 방장일 경우 전역변수에 방장 정보 추가
    if (user["is_host"] === true) {
      gameState.hostUser = user["participant"]["id"];
    }
  });

  // 유저가 방장이 아닐 경우 start버튼 숨기기
  if (gameState.userId !== gameState.hostUser) {
    document.getElementById("start").style = "display: none;";
  }
}

function initUsers() {
  for (let j = 1; j <= 4; j++) {
    const userName = document.getElementById(`username-${j}`);
    const userBox = document.getElementById(`user-box-${j}`);
    userName.innerText = "";
    userBox.querySelector(".profile-container img").src = "";
    document.getElementById(`userimage-${j}`).src = "";
  }
}

/* 현재 유저 수 이상의 박스는 숨기는 함수 */
function hideUnusedUserBoxes(maxUser) {
  for (let i = maxUser + 1; i <= 4; i++) {
    let userBox = document.getElementById(`user-box-${i}`);
    userBox.style = "visibility: hidden;";
  }
}

/* 유저 정보 DOM요소 업데이트 함수 */
function updateUserBox(user, index) {
  let userBox = document.getElementById(`user-box-${index}`);
  let userImage;

  // 박스에 유저 아이디 붙여주기
  userBox.setAttribute("data-id", user["participant"]["id"]);

  // 유저 설정 이미지 있는지 여부에 따라 이미지 다르게 보여주기
  if (user["participant"]["image"]) {
    userImage = `${BACK_BASE_URL}${user["participant"]["image"]}`;
  } else {
    const randomPick = Math.floor(Math.random() * 5 + 1);
    userImage = `/img/user-profile/${randomPick}.png`;
  }
  userBox.querySelector(`#user-box-${index} .profile-container img`).src =
    userImage;

  // 유저 이름 보여주기
  const userName = document.getElementById(`username-${index}`);
  userName.innerText = user["participant"]["username"];
  userName.addEventListener("click", () => {
    window.location.href = `/html/mypage.html?id=${user["participant"]["id"]}`;
  });

  // 유저 칭호 보여주기
  if (user["is_host"]) {
    document.getElementById(`userimage-${index}`).src = "/img/fake/crown.png";
  } else {
    if (user["participant"]["wear_achievement"] !== -1) {
      user["participant"]["achieve"].foreach((achieve) => {
        if (achieve["id"] === user["participant"]["wear_achievement"]) {
          document.getElementById(
            `userimage-${index}`
          ).src = `/${achieve["image_url"]}`;
        }
      });
    }
  }
}

init();

/**
 * 웹소켓 파트 시작
 */

/* 페이지 들어왔을 때 join_room 메세지 */
socket.onopen = function (e) {
  socket.send(
    JSON.stringify({
      type: "join_room",
      room: gameState.roomName,
    })
  );

  socket.send(
    JSON.stringify({
      type: "chat_message",
      message: "접속했습니다.",
    })
  );
};

/* 서버에서 받은 웹소켓 메세지에 따라 다른 함수 실행 */
socket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  switch (data.method) {
    case "chat_message":
      chatMessage(data);
      break;

    case "chat_message_correct_answer":
      gameState.nowQuiz["solved"] = true;
      chatMessage(data);
      break;

    case "send_quiz":
      gameState.quiz = data.quiz;
      gameState.quizCount = 0;
      selector.startBtn.style = "display: none;";
      gameState.startGame = true;
      showQuiz();
      break;

    case "next_quiz":
      gameState.quizCount++;
      setTimeout(showQuiz, 3000);
      break;

    case "end_quiz":
      gameState.quizCount = 0;
      resultQuiz();
      const explain = document.getElementById("explains-text");
      const quizAnswer = document.getElementById("quizAnswer");
      const handleHint = document.getElementById("quizHint");
      for (let i = 1; i < 6; i++) {
        const example = document.getElementById(`examples-${i}`);
        example.innerText = "";
      }
      explain.innerText = "";
      quizAnswer.innerHTML = "";
      handleHint.innerHTML = "";

      gameState.startGame = false;
      if (gameState.userId === gameState.hostUser) {
        selector.startBtn.style = "display: revert;";
      }
      break;

    case "room_check":
      injectUsers(data.message);
      break;

    case "leave_host":
      forcedLeave();
      break;

    case "reject_leave":
      rejectLeave();
      break;

    case "accept_leave":
      break;

    case "notification":
      break;

    default:
      console.error("웹소켓 통신에 문제가 발생했습니다.");
  }
};

/* 메세지를 채팅창에 보여주는 함수 */
function chatMessage(data) {
  let chatLog = document.getElementById("chat-log");
  chatLog.value += data.message + "\n";
  chatLog.scrollTop = chatLog.scrollHeight;

  // 버블링 메세지
  if (data.user) {
    chatBubbling(data.user, data.message);
  }
}

/* 메세지를 버블로 보여주는 함수 */
function chatBubbling(userId, message) {
  const boxSelect = document.querySelector(`[data-id="${userId}"]`);

  // 이전 말풍선 제거
  if (boxSelect) {
    if (gameState.lastChats[userId]) {
      gameState.lastChats[userId].style.opacity = 0;
      boxSelect.removeChild(gameState.lastChats[userId]);
    }

    // 새로운 말풍선 생성
    const newBubble = document.createElement("div");
    newBubble.classList.add("bubble");
    newBubble.textContent = message;

    // 말풍선 위치 지정
    newBubble.style.top = "30px";
    if (boxSelect.id === "user-box-1" || boxSelect.id === "user-box-3") {
      newBubble.style.left = `${boxSelect.offsetWidth + 5}px`;
    } else {
      newBubble.style.right = `${boxSelect.offsetWidth + 5}px`;
    }

    // 말풍선 넣기
    boxSelect.appendChild(newBubble);

    // 말풍선 저장
    gameState.lastChats[userId] = newBubble;

    // 말풍선 opacity적용
    setTimeout(() => {
      newBubble.style.opacity = 1;
      setTimeout(() => {
        newBubble.style.opacity = 0;

        setTimeout(() => {
          if (boxSelect.contains(newBubble)) {
            boxSelect.removeChild(newBubble);
          }
          delete gameState.lastChats[userId];
        }, 50); // 0.05초 세팅
      }, 3000);
    }, 50);
  } else {
    console.warn(`${gameState.userId}의 유저 정보 없음`);
  }
}

/* 게임 시작 버튼 눌렀을 때 실행하는 함수 */
function gameStart() {
  if (gameState.userId === gameState.hostUser) {
    gameState.startGame = true;
    socket.send(
      JSON.stringify({
        type: "start_game",
        message: "start game",
      })
    );
  }
}

/* 방 나갔을 때 함수 */
function roomQuit() {
  socket.send(
    JSON.stringify({
      type: "leave_room",
      message: "나갔습니다.",
    })
  );

  window.location.href = "/html/battle/lobby.html";
}

function forcedLeave() {
  alert("방장이 나갔습니다. 방을 나갑니다.");
  setTimeout(() => {
    window.location.replace("/html/battle/lobby.html"), 4000;
  });
}

function rejectLeave() {
  socket.send(
    JSON.stringify({
      type: "chat_message",
      message: "게임이 진행중일 때는 나갈 수 없습니다.",
    })
  );
}

function acceptLeave() {
  window.location.replace("/html/battle/lobby.html");
}

function showQuiz() {
  gameState.nowQuiz = gameState.quiz[gameState.quizCount]["dict_word"];
  gameState.quiz_answer = gameState.nowQuiz["word"];
  for (let i = 1; i <= gameState.nowQuiz["examples"].length; i++) {
    const explain = document.getElementById("explains-text");
    explain.innerText = `${gameState.quiz[gameState.quizCount]["content"]} (${
      gameState.quiz_answer.length
    }글자)`;
    const example = document.getElementById(`examples-${i}`);
    example.innerText = `${i}: ${gameState.nowQuiz["examples"][i - 1]}`;
  }
  const quizAnswer = document.getElementById("quizAnswer");
  selector.handleHint = document.getElementById("quizHint");
  quizAnswer.innerHTML = "";
  selector.handleHint.innerHTML = "";

  gameState.showHintTimeout = setTimeout(showHintCount, 5000);
}

function showHintCount() {
  let hintCount = 5;

  if (gameState.countdown) {
    clearInterval(gameState.countdown);
  }
  gameState.countdown = setInterval(() => {
    hintCount -= 1;
    selector.handleHint.innerHTML = `힌트: <span id="hint">${hintCount}</span>`;

    if (hintCount === 0) {
      clearInterval(gameState.countdown);
      showHint();
    }
  }, 1000);
}

function showHint() {
  let hint = gameState.nowQuiz["hint"];
  let hintComponent = hint.split("");

  selector.handleHint.innerHTML = `힌트: <span id="hint">${hint}</span>`;

  let hintInterval = setInterval(() => {
    const hintIndexes = [];

    for (let i = 0; i < hintComponent.length; i++) {
      if (hintComponent[i] === gameState.nowQuiz["hint"][i]) {
        hintIndexes.push(i);
      }
    }

    if (hintIndexes.length === 0) {
      clearInterval(hintInterval);
      return;
    }

    const randomReplaceIndex =
      hintIndexes[Math.floor(Math.random() * hintIndexes.length)];

    hintComponent[randomReplaceIndex] =
      gameState.quiz_answer[randomReplaceIndex];

    selector.handleHint.innerHTML = `힌트: <span id="hint">${hintComponent.join(
      ""
    )}</span>`;
  }, 5000);
}

function stopHintCountdown() {
  if (gameState.countdown) {
    clearInterval(gameState.countdown);
  }
  if (gameState.showHintTimeout) {
    clearTimeout(gameState.showHintTimeout);
  }
}

function correctQuiz() {
  stopHintCountdown();
  const userInput = document.getElementById("chat-message-input").value;
  if (userInput === gameState.quiz_answer) {
    const answer = document.getElementById("quizAnswer");
    answer.innerHTML = `정답 : <span id="answer">${gameState.quiz_answer}</span>`;
    if (gameState.quiz.length === gameState.quizCount + 1) {
      socket.send(
        JSON.stringify({
          type: "correct_answer",
          message: "퀴즈 끝",
          end: true,
        })
      );
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

/**
 * 채팅 관련 함수
 */

/* 채팅 입력 관련 함수 핸들링 */
function handleChat() {
  document.getElementById("chat-message-input").focus();
  const chatInputDom = document.getElementById("chat-message-input");

  // 엔터 입력했을 경우
  chatInputDom.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === 13) {
      sendMessage();
    }
  });

  // 보내기 버튼 클릭했을 경우
  const chatSubmitDom = document.getElementById("chat-message-submit");

  chatSubmitDom.addEventListener("click", () => {
    sendMessage();
  });
}

function sendMessage() {
  const messageInputDom = document.getElementById("chat-message-input");
  const message = messageInputDom.value;

  socket.send(
    JSON.stringify({
      type: "chat_message",
      message: message,
    })
  );
  if (gameState.startGame && !(gameState.nowQuiz.hasOwnProperty("solved"))) {
    correctQuiz();
  }

  messageInputDom.value = "";
}

/**
 * 초대 시작
 */

function inviteModal() {
  selector.modal.classList.toggle("show");
}

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
