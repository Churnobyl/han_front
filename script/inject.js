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
  const footerHtml = await fetch("/html/footer.html");
  let data = await footerHtml.text();
  document.querySelector(".footer").innerHTML = data;
}

// 네비바, 푸터 전부 불러온 다음에 이벤트리스너 부착
Promise.all([injectNavbar(), injectFooter()])
  .then(() => loadComponent())
  .then(() => {
    // websocketLoading();
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
  window.location.href = "/html/signup.html";
}

function goLogout() {
  // 로그아웃
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/; Secure";
  window.location.href = "/";
}

async function websocketLoading() {
  const access = localStorage.getItem("access");
  if (access !== null) {
    const nowPage = window.location.pathname;
    const pageSplit = nowPage.split("/");
    const pageName = pageSplit[pageSplit.length - 1].split(".")[0];
    if (
      !(
        pageName === "battle-page" ||
        pageName === "lobby" ||
        pageName == "create-room"
      )
    ) {
      /* 웹소켓 관련 */
      const urlParams = new URLSearchParams(window.location.search);
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

      const token = localStorage.getItem("access");

      const chatSocket = new WebSocket(
        "ws://" +
          BACK_WEBSOCKET_URL +
          "/ws/notification" +
          "/?page=" +
          pageName +
          "&token=" +
          token
      );

      chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        document.getElementById("chat-log").value += data.message + "\n";
      };

      chatSocket.onclose = function (e) {
        console.error("Chat socket closed unexpectedly");
      };

      chatSocket.onopen = () => {
        chatSocket.send(
          JSON.stringify({
            // roomData: roomData,
            message: "접속했습니다.",
          })
        );
      };
    }

    /* 웹소켓 관련 end */
  }
}
