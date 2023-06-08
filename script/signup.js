import { signupApi } from "./api.js";

// 회원가입
document.getElementById("btnSignup").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const username = document.getElementById("username").value;

  if (password !== password2) {
    alert("비밀번호가 일치하지 않습니다.");
  } else {
    const signupData = {
      "email": email,
      "password": password,
      "username": username
    };

    try {
      const response = signupApi(signupData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
});
