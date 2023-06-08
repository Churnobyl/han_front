async function injectMainPage() {
  // 메인페이지 삽입
  for (let i = 1; i < 6; i++) {
    const navbarHtml = await fetch(`/html/landingPage/page${i}.html`);
    let data = await navbarHtml.text();
    document.querySelector(`div[data-anchor="page-${i}"]`).innerHTML = data;
  }
}

injectMainPage();

new Pageable("#scrollableContainer", {
  // 페이지 plugin
  pips: true,
  animation: 800,
  delay: 500,
  onBeforeStart: () => {
    document.querySelector(".nav").classList.add("nav-transparent");
  },
});

window.onload = () => {
  /**
   * 슬라이드 로딩 지연으로 setTimeout설정
   */
  setTimeout(() => {
    document.getElementById("menuStart").addEventListener("click", goQuiz);
    document.getElementById("mainStart").addEventListener("click", goQuiz);
    document.getElementById("menuLogin").addEventListener("click", goLogin);
    document.querySelector(".logo").addEventListener("click", goHome);
  }, 1000);
};

function goQuiz() {
  window.location.assign("/html/quiz.html");
}

function goLogin() {
  window.location.assign("/html/login.html");
}

function goHome() {
  window.location.assign("/html/index.html");
}
