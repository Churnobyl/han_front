import { signupApi } from "./api.js";

document.getElementById("btnSignup").addEventListener("click", () => {
  // 회원가입
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const username = document.getElementById("username").value;

  if (password !== password2) {
    alert("비밀번호가 일치하지 않습니다.");
  } else {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);

    try {
      const response = signupApi(formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
});
