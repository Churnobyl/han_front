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
    const username = document.getElementById("navUserName");
    username.setAttribute(
      "href",
      `/html/mypage.html?id=${jsonPayload.user_id}`
    );
    username.innerText = getUsername;
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html"
    ) {
      document.getElementById("menuHome").style.display = "block";
    }
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
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
  } else {
    const footerHtml = await fetch("/html/footer.html");
    let data = await footerHtml.text();
    document.querySelector(".footer").innerHTML = data;
  }
}

async function injectNotification() {
  // 알림창 삽입
  const notificationHtml = await fetch("/html/notification.html");
  let data = await notificationHtml.text();
  document.querySelector(".component-wrap").innerHTML += data;
}

// 네비바, 푸터, 알림창 전부 불러온 다음에 이벤트리스너 부착
Promise.all([injectNavbar(), injectFooter()])
  .then(() => {
    loadComponent();
    injectNotification();
  })
  .then(() => {
    const allSurveyBtns = document.querySelectorAll(".menu-survey");

    for (const btn of allSurveyBtns) {
      btn.addEventListener("click", () => {
        window.open(
          "https://docs.google.com/forms/d/e/1FAIpQLSeGKaUdU2awd6gkbd9Oqu4CN2VkXUNIhk2QnTXz1zGMFycPIQ/viewform?vc=0&c=0&w=1&flr=0",
          "_blank"
        );
      });
    }
  });

function loadComponent() {
  // 각 컴포넌트에 이벤트리스너 부착
  document.getElementById("btnLogout").addEventListener("click", goLogout);
  const logos = document.querySelectorAll(".logo");
  for (let logo of logos) {
    logo.addEventListener("click", goHome);
  }
  document.getElementById("menuStart").addEventListener("click", goStart);
  document.getElementById("menuLogin").addEventListener("click", goLogin);
  const access = localStorage.getItem("access");
  if (access) {
    document
      .querySelector(".component-wrap")
      .addEventListener("click", notificationDropdownOpen);
  }
}

function goHome() {
  // 홈으로
  if (window.location.pathname === "/html/") {
    window.location.href = "/html/";
  } else {
    window.location.href = "/html/home.html";
  }
}

function goLogin() {
  // 로그인
  window.location.href = "/html/login.html";
}

function goStart() {
  // 시작
  window.location.href = "/html/quiz.html";
}

function goLogout() {
  // 로그아웃
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/; Secure";
  window.location.href = "/";
}

function notificationDropdownOpen() {
  const dropdown = document.getElementById("notification-dropdown");
  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
}
