import { loginApi } from "./api.js";
import { FRONT_BASE_URL } from "./conf.js";

/* 로그인한 유저 메인화면으로 이동 */
const payload = localStorage.getItem("payload");
const payloadParse = JSON.parse(payload);

if (payloadParse != null) {
  window.location.href = `${FRONT_BASE_URL}/html/home.html`;
}
/* 로그인한 유저 메인화면으로 이동 end */

// 엔터했을 때 로그인 함수 동작
const inputs = document.querySelectorAll("input");
for (let input of inputs) {
  input.addEventListener("keyup", (e) => {
    if (e.key === 13 || e.key === "Enter") {
      handleLogin();
    }
  });
}

// 버튼 클릭했을 때 로그인 함수 동작
document.getElementById("btnLogin").addEventListener("click", handleLogin);

function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email: email,
    password: password,
  };

  loginApi(loginData);
}
