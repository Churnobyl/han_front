async function injectNavbar() {
  // 네비게이션 바 삽입
  const navbarHtml = await fetch("/html/nav.html");
  let data = await navbarHtml.text();

  document.querySelector(".nav").innerHTML = data;

  const forUser = document.getElementById("navBarForUser");
  const forAnonymous = document.getElementById("navBarForAnonymous");

  const access = localStorage.getItem("access");

  // 로그인 되어 있다면 forUser를 보여주기
  if (access) {
    forUser.style.display = "block";
    forAnonymous.style.display = "none";
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
    forUser.style.display = "none";
    forAnonymous.style.display = "block";
  }
}

injectNavbar();

async function injectFooter() {
  // 푸터 삽입
  const footerHtml = await fetch("/html/footer.html");
  let data = await footerHtml.text();
  document.querySelector(".footer").innerHTML = data;
}

injectFooter();

setTimeout(() => {
  // nav바 로딩 지연으로 setTimeout설정
  document.getElementById("btnLogout").addEventListener("click", goLogout);
  document.querySelector(".logo").addEventListener("click", goHome);
}, 1000);

function goHome() {
  window.location.assign("/html/");
}

function goLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
  window.location.href = "/html/index.html";
}
