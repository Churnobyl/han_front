import { loginApi } from "./api.js";
import { FRONT_BASE_URL, BACK_BASE_URL } from "./conf.js";

/* 로그인한 유저 메인화면으로 이동 */
const access = localStorage.getItem("access");
const accessParse = JSON.parse(access);

if (accessParse != null) {
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

document.getElementById("btnGoogleLogin").addEventListener("click", handleGoogleLogin);
document.getElementById("btnKakaoLogin").addEventListener("click", handleKakaoLogin);
document.getElementById("btnNaverLogin").addEventListener("click", handleNaverLogin);

function handleGoogleLogin() {
  window.location.href = BACK_BASE_URL + "/users/google/login/"
}

function handleKakaoLogin() {
  window.location.href = BACK_BASE_URL + "/users/kakao/login/"
}

function handleNaverLogin() {
  window.location.href = BACK_BASE_URL + "/users/naver/login/"
}