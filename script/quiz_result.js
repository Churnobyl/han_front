import { checkAnonymous } from "./api.js";
import { FRONT_BASE_URL, BACK_BASE_URL } from "./conf.js";

checkAnonymous();

// access token에서 유저 닉네임 받아오기
const token = localStorage.getItem("access");
const payload = token.split(".")[1];
const decodedPayload = JSON.parse(atob(payload));
const userId = decodedPayload["user_id"];

let correctCount = JSON.parse(localStorage.getItem("correctCount"));

window.onload = async function () {
  const checkCount = correctCount === 0 ? true : correctCount;
  if (checkCount) {
    // 정답 개수
    const quizResult = document.getElementById("quiz-result");
    quizResult.innerText = `전체 문제 중 🎉${correctCount}개🎉를 맞췄어요!`;

    // 결과 메세지
    const resultMsg = document.getElementById("quiz-text");
    if (correctCount > 7) {
      resultMsg.innerText = "당신은 한글의 수호자!";
    } else if (correctCount >= 3 && correctCount <= 7) {
      resultMsg.innerText = "당신은 평균 한국인!";
    } else if (correctCount < 3) {
      resultMsg.innerText = "당신은 한글의 새싹!";
    }

    // 경험치 바
    const response = await fetch(`${BACK_BASE_URL}/users/${userId}/`, {
      method: "GET",
    });
    const responseJson = await response.json();
    const info = responseJson["정보"];

    const expProgress = document.getElementById("exp");
    document.getElementById(
      "userLevel"
    ).innerText = `현재 레벨 :  ${info["level"]} (${info["experiment"]}/${info["max_experiment"]})`;
    expProgress.setAttribute("max", info["max_experiment"]);
    expProgress.setAttribute("value", info["experiment"]);
    const xpText = document.getElementById("xp-text");
    xpText.innerText = `${correctCount * 10}xp 획득`;
  } else {
    alert("이미 퀴즈를 재시작했거나, 퀴즈 결과가 없습니다!");
    window.location.replace(`${FRONT_BASE_URL}/html/home.html`);
  }

  document.getElementById("my-page").addEventListener("click", goMyPage);
  document.getElementById("home").addEventListener("click", goHome);
};

function goMyPage() {
  window.location.href = `${FRONT_BASE_URL}/html/mypage.html?id=${userId}`;
}

function goHome() {
  window.location.href = `${FRONT_BASE_URL}/html/home.html`;
}
