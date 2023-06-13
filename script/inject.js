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
    const payload = localStorage.getItem("payload")
    const userId = payload.split(':')[5].slice(0, -1);

    const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
      method:"GET",
    })
    const responseJson = await response.json()
    console.log(responseJson)

    forUser.style.display = "block";
    forAnonymous.style.display = "none";
    forSign.style.display = "none";
    console.log(responseJson["유저"]["username"]==="")
    if (responseJson["유저"]["username"]==="") {
      document.getElementById("navUserName").innerText = responseJson["유저"]["email"];
    }
    else {
      document.getElementById("navUserName").innerText = responseJson["유저"]["username"];
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
