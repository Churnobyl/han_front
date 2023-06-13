import { googleLogin, kakaoLogin, naverLogin } from "./api.js";

async function injectMainPage() {
  // 메인페이지 삽입
  for (let i = 1; i < 6; i++) {
    const navbarHtml = await fetch(`/html/landingPage/page${i}.html`);
    let data = await navbarHtml.text();
    document.querySelector(`div[data-anchor="page-${i}"]`).innerHTML = data;
  }
}

function showSpinner() {
  const loader = document.getElementById("spinner");
  loader.style.display = "grid";
}

function hideSpinner() {
  const loader = document.getElementById("spinner");
  loader.style.display = "none";
}

window.onload = () => {
  /**
   * 슬라이드 로딩 지연으로 setTimeout설정
   */
  setTimeout(() => {
    document.getElementById("menuStart").addEventListener("click", goQuiz);
    document.getElementById("mainStart").addEventListener("click", goQuiz);
    document.getElementById("menuLogin").addEventListener("click", goLogin);
    document.querySelector(".logo").addEventListener("click", goHome);
  }, 500);

  const search = window.location.search
  console.log(search)
  if (search.includes("google")) {
    googleLoginSend(search)
  }
  else if (search.includes("state")) {
    console.log("naver")
    naverLoginSend(search)
  }
  else {
    kakaoLoginSend(search)
  }
};
async function loadSteps() {
  showSpinner();
  injectMainPage()
    .then(() => slidingPage())
    .then(() => {
      loadClickComponent();
      hideSpinner();
    })
    .catch((error) => {
      hideSpinner();
      console.error(error);
    });
}

loadSteps();

function slidingPage() {
  new Pageable("#scrollableContainer", {
    // 페이지 plugin
    pips: true,
    animation: 800,
    delay: 500,
    onBeforeStart: () => {
      document.querySelector(".nav").classList.add("nav-transparent");
    },
  });
}

function loadClickComponent() {
  // 컴포넌트 클릭 이벤트 부여
  document.getElementById("menuStart").addEventListener("click", goQuiz);
  document.getElementById("mainStart").addEventListener("click", goQuiz);
  document.getElementById("menuLogin").addEventListener("click", goLogin);
  document.querySelector(".logo").addEventListener("click", goHome);
  document.getElementById("btnLogout").addEventListener("click", goLogout);
}

async function googleLoginSend(search) {
  const response = await googleLogin(search)
}

async function kakaoLoginSend(search) {
  const response = await kakaoLogin(search)
}

async function naverLoginSend(search) {
  const response = await naverLogin(search)
}

function goQuiz() {
  window.location.href = "/html/quiz.html";
}

function goLogin() {
  window.location.href = "/html/login.html";
}

function goHome() {
  window.location.href = "/html/";
}

function goLogout() {
  // 로그아웃
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
  window.location.href = "/html/home.html";
}
