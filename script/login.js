import { loginApi, checkLoginUser } from "./api.js";
import { BACK_BASE_URL } from "./conf.js";

checkLoginUser();

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

document
  .getElementById("btnGoogleLogin")
  .addEventListener("click", function () {
    window.location.href = BACK_BASE_URL + "/users/google/login/";
  });
document.getElementById("btnKakaoLogin").addEventListener("click", function () {
  window.location.href = BACK_BASE_URL + "/users/kakao/login/";
});
document.getElementById("btnNaverLogin").addEventListener("click", function () {
  window.location.href = BACK_BASE_URL + "/users/naver/login/";
});
