import { signupApi, checkLoginUser } from "./api.js";

checkLoginUser();

// 엔터했을 때 회원가입 함수 동작
const inputs = document.querySelectorAll("input");
for (let input of inputs) {
  input.addEventListener("keyup", (e) => {
    if (e.key === 13 || e.key === "Enter") {
      handleSignup();
    }
  });
}

// 클릭했을 때 회원가입 함수 동작
document.getElementById("btnSignup").addEventListener("click", handleSignup);

function handleSignup() {
  // 회원가입
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const username = document.getElementById("username").value;

  if (password !== password2) {
    alert("비밀번호가 일치하지 않습니다.");
  } else if (email==="" && password==="" && username==="" && password2==="") {
    alert("정보를 모두 입력해주세요.")
  } else {
    const signupData = {
      email: email,
      password: password,
      username: username,
    };

    signupApi(signupData).then(({ response, responseJson }) => {
      if (response.status === 201) {
        alert(responseJson.message);
        window.location.href = "/html/login.html";
      } else if (response.status === 400) {
        alert("이미 가입된 이메일 계정이 있습니다.");
      } else {
        alert(responseJson.message);
      }
    });
  }
}

document
  .getElementById("btnGoogleSignup")
  .addEventListener("click", handleGoogleSignup);
document
  .getElementById("btnKakaoSignup")
  .addEventListener("click", handleKakaoSignup);
document
  .getElementById("btnNaverSignup")
  .addEventListener("click", handleNaverSignup);

function handleGoogleSignup() {
  window.location.href = BACK_BASE_URL + "/users/google/login/";
}

function handleKakaoSignup() {
  window.location.href = BACK_BASE_URL + "/users/kakao/login/";
}

function handleNaverSignup() {
  window.location.href = BACK_BASE_URL + "/users/naver/login/";
}
