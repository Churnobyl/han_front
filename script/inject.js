async function injectNavbar() {
  // 네비게이션 바 삽입
  const navbarHtml = await fetch("/html/nav.html");
  let data = await navbarHtml.text();

  document.querySelector(".nav").innerHTML = data;

  const forUser = document.getElementById("navBarForUser");
  const forAnonymous = document.getElementById("navBarForAnonymous");
  const forSign = document.getElementById("navBarForSign");

  const access = localStorage.getItem("access");

  // 로그인 되어 있다면 forUser를 보여주기
  if (access) {
    forUser.style.display = "block";
    forAnonymous.style.display = "none";
    forSign.style.display = "none";
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
    document.getElementById("navUserName").innerText = getUsername;
  } else {
    // 로그인 되어 있지 않다면 forAnonymous를 보여주기
    const nowPath = window.location.pathname;
    if (nowPath === "/html/login.html" || nowPath === "/html/signup.html") {
      forUser.style.display = "none";
      forAnonymous.style.display = "none";
      forSign.style.display = "block";
    } else {
      forUser.style.display = "none";
      forAnonymous.style.display = "block";
      forSign.style.display = "none";
    }
  }
}

async function injectFooter() {
  // 푸터 삽입
  const footerHtml = await fetch("/html/footer.html");
  let data = await footerHtml.text();
  document.querySelector(".footer").innerHTML = data;
}

// 네비바, 푸터 전부 불러온 다음에 이벤트리스너 부착
Promise.all([injectNavbar(), injectFooter()]).then(() => loadComponent());

function loadComponent() {
  // 각 컴포넌트에 이벤트리스너 부착
  document.getElementById("btnLogout").addEventListener("click", goLogout);
  const logos = document.querySelectorAll(".logo");
  for (let logo of logos) {
    logo.addEventListener("click", goHome);
  }
  document.getElementById("menuStart").addEventListener("click", goQuiz);
  document.getElementById("menuLogin").addEventListener("click", goLogin);
}

function goHome() {
  // 홈으로
  if (
    window.location.pathname === "/html/" ||
    window.location.pathname === "/html/index.html"
  ) {
    window.location.href = "/html/";
  } else {
    window.location.href = "/html/index.html";
  }
}

function goLogin() {
  // 로그인
  window.location.href = "/html/login.html";
}

function goQuiz() {
  // 시작 퀴즈
  window.location.href = "/html/quiz.html";
}

function goLogout() {
  // 로그아웃
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
  window.location.href = "/html/index.html";
}
