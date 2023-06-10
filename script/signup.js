import { signupApi } from "./api.js";
// import { googleApi } from "./api.js";

document.getElementById("btnSignup").addEventListener("click", () => {
  // 회원가입
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const username = document.getElementById("username").value;

  if (password !== password2) {
    alert("비밀번호가 일치하지 않습니다.");
  } else {
    const signupData = {
      email: email,
      password: password,
      username: username,
    };

    signupApi(signupData).then(({ response, responseJson }) => {
      if (response.status === 201) {
        alert(responseJson.message);
        window.location.href = "/html/index.html";
      } else if (response.status === 400) {
        alert("이미 가입된 이메일 계정이 있습니다.");
      } else {
        alert(responseJson.message);
      }
    });
  }
});
