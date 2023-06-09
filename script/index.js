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
  document.getElementById("menuHome").addEventListener("click", goHomePage);
  document.getElementById("btnLogout").addEventListener("click", goLogout);
}

function goQuiz() {
  window.location.href = "/html/quiz.html";
}

function goLogin() {
  window.location.href = "/html/login.html";
}

function goHome() {
  window.location.href = "/";
}

function goHomePage() {
  window.location.href = "/html/home.html";
}

function goSurvey() {
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSeGKaUdU2awd6gkbd9Oqu4CN2VkXUNIhk2QnTXz1zGMFycPIQ/viewform?vc=0&c=0&w=1&flr=0",
    "_blank"
  );
}

function goLogout() {
  // 로그아웃
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/html/home.html";
}
